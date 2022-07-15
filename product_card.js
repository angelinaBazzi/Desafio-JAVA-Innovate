const products = document.getElementById('products')
const templateCard = document.getElementById('template-card').content
const fragment = document.createDocumentFragment()


//recibe los productos que debe mostrar
// arma cada product card 

export const card_product = data => {
    data.forEach((product, key , map) => {

        //limpia y carga los template 
        //templates de => .description, #fav, .slider, .price, price_compare || limpia =>  .inventoryQuantity .size_product #fotos .images .srcImages
        loadTemplate (product)

        let imagesColor = []
        let imagesSize = []
        let flag_color = 0
        let flag_size = 0
        let arraydata = []

        //array donde se guardan las opciones de colores  y de talles => options.values
        valuesOfOptions(product.options,imagesColor,imagesSize,flag_color,flag_size)
        //validationOptions(flag_color,flag_size,product.options)

        //Por cada opcion de color obtenido del Json almacenado en imagesColor carga las imagenes circulares de opciones - 
        // - da tamaño al scroll dependiendo el widht de la images - agrega el array a mostrar en el carousel 
        loadImages(imagesColor,arraydata,product)

        // guarda los src de todas las imagenes del producto
        imagesSrc(arraydata)

        //carga talles al template para mostrar              
        showSizes (imagesSize)
        
        //***************************************
        //clona el template
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)  

    })
    products.appendChild(fragment)
}

//************************************************************** FUNCTIONS ***************************************************/
function  loadTemplate (product){ 
    templateCard.querySelector('.description').textContent = product.body_html
    templateCard.querySelector('#fav').dataset.id = product.id
    templateCard.querySelector(".slider").dataset.id = product.id

    // por defecto muestra el precio de la primer variante 
    templateCard.querySelector(".price").textContent = "$"+ product.variants[0].price        
    templateCard.querySelector(".price_compare").innerHTML = ''

    if (product.variants[0].compare_at_price != null){
        templateCard.querySelector(".price_compare").textContent = "$"+ product.variants[0].compare_at_price
    }

    templateCard.querySelector(".inventoryQuantity").innerHTML = ''
    templateCard.querySelector(".size_product").innerHTML = ''

    templateCard.querySelector("#fotos").innerHTML = ''
    templateCard.querySelector(".images").innerHTML = ''
    templateCard.querySelector(".srcImages").innerHTML = ''
}



//guarda los valores de las opciones 
function  valuesOfOptions(options,imagesColor,imagesSize,flag_color,flag_size){
    if (options != null) {
        options.forEach(i => {
            if (i.name.includes("Color")) {
                i.values.forEach(c => {
                    imagesColor.push(c)
                    flag_color = +1
                })
            }
            if (i.name.includes("Talle")) {
                i.values.forEach(c => {
                    imagesSize.push(c)
                    flag_size = +1
                })
            }
        })
    }
}

function validationOptions(flag_color,flag_size,options){    //flags opciones X talle y color
    if (flag_color == 0) {
        console.log("No hay opciones de colores");
    }
    if (flag_size == 0) {
        console.log("No hay opciones de talles");
    }
    if (options == "") {
        console.log("no tiene opciones")
    }
}

function loadImages(imagesColor,arraydata,product){
    let flag = 0

    for (let a = 0; a < imagesColor.length; a++) {
        let imgColor = []
        let colores = []

        for (let i = 0; i < product.images.length; i++) {
            if (product.images[i].alt == null){
                console.log("El product =>",product.title," en la img => ", product.images[i].id," no se distingue el color. (Alt = null)"); 
            }else{
                let cadena = product.images[i].alt
                let color = cadena.split('#')
                let color2 = color.pop().toUpperCase()
                if (imagesColor[a] == color2) {
                    imgColor.push(product.images[i])
                    colores.push(product.images[i],color2)                    
                }
            }
        }

        if(imgColor!=''){
            //agrega images de variantes de colores (images abajo)
            var foto = document.createElement("img")
            foto.setAttribute("src", imgColor[0].src)
            foto.className = "imagesContainer"
            foto.setAttribute("id", colores[1]);
            templateCard.querySelector('#fotos').appendChild(foto)
        
            // agrega primeras fotos por defecto al carrusel 
            loadImagesCarousel(flag,imgColor,colores)

            //añade tamaño del carousel=> imagen con mayor widht y longitud al boton de compra 
            carouselWidht(imgColor)

            // arrayInventory contiene => (idProducto , color , size , cantidad , price ,titulo)

            
            var arrayInventory = []
            for (let i = 0; i < imgColor.length; i++) {
                arraydata.push(imgColor[i].src,imgColor[i].width,imgColor[i].height)
                for(let d=0;d<product.variants.length; d ++){
                    if(imgColor[i].id == product.variants[d].image_id ){
                        arrayInventory.push(product.variants[d].product_id,product.variants[d].option1,product.variants[d].option2,product.variants[d].inventory_quantity,product.variants[d].price,product.variants[d].title)                         
                    }                       
                }
            }   

            //carga los datos del arrayInventory al dataset en ".dataInventory"
            arrayInventory.forEach( e =>{
                let inv = document.createElement("div")
                inv.dataset.array_prod = e
                templateCard.querySelector('.dataInventory').appendChild(inv)
            })               
            flag = 1
            arraydata.push('stop')
        }
    }
}

function imagesSrc(arraydata){
    for (let i = 0; i < arraydata.length; i++) {
        var element = document.createElement("img")
        element.dataset.img = arraydata[i]
        templateCard.querySelector('.srcImages').appendChild(element)
    }
}

function showSizes (imagesSize){
    var element = document.createElement("div")
    element.className = "inventoryQuantity"
    element.textContent = "Selecciona tu talle"
    templateCard.querySelector(".inventoryQuantity").appendChild(element)

    for (let i = 0; i < imagesSize.length; i++) {
        var element = document.createElement("div")
        element.textContent = imagesSize[i]
        element.className = "size"
        templateCard.querySelector(".size_product").appendChild(element)
    }
}

function loadImagesCarousel(flag,imgColor,colores){
    if (flag != 1) {
        for (let i = 0; i < imgColor.length; i++) {
            var element = document.createElement("img")
            
            element.setAttribute("src", imgColor[i].src)
            element.className = "image"
            element.dataset.width = imgColor[i].width*0.19
            element.style.width = imgColor[i].width*0.19+ "px "
            element.style.height = imgColor[i].height*0.19+ "px "                       
            element.setAttribute("id", colores[1]) 
            templateCard.querySelector(".images").appendChild(element)    

        }   
    }
}

function carouselWidht(imgColor){
    
    var carousel =templateCard.querySelector('.carousel')
    let flagWidht = imgColor[0].height
    let id = 0               

    for (let i=0 ; i <imgColor.length; i++){
        if(imgColor[i].height> flagWidht){                        
            id = i
        }
    }
    carousel.style.width =  imgColor[id].width*0.19 +"px"
    carousel.style.height = imgColor[id].height*0.19+ "px"
    templateCard.querySelector(".btn-dark").style.width = imgColor[id].width*0.18 +"px"
    templateCard.querySelector(".size_product").style.width = (imgColor[id].width*0.18)/2 +"px"            
    templateCard.querySelector(".size_product").dataset.width=(imgColor[id].width*0.18)/2 
    templateCard.querySelector(".inventoryQuantity").style.width = (imgColor[id].width*0.18)/2 +"px"
    templateCard.querySelector(".inventoryQuantity").dataset.width=(imgColor[id].width*0.18)/2 
}


// ***************************************************************** EVENTLISTENER  ****************************************************************************************// 
products.addEventListener("click", i => {
    favFunction(i)
    scrollImages(i)  //cambia imagenes por seleccion 
    size(i)
})

products.addEventListener("mouseover", i =>{
    hoverSize(i)
    carousel(i)
})

document.addEventListener("mouseover", i =>{
    document.querySelector(".favoriteAlert").style = "display:none;"
})



//---------------------Function event listener--------------//

// show inventory quantity per size
const hoverSize = h =>{
    if (h.target.classList.contains('size')){
        setInventory_quantity(h.target)
    }
        h.stopPropagation(h.target.parentElement)
}

const setInventory_quantity = h =>{
    let object = h.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement
    let show = object.querySelector(".inventoryQuantity")
    let inventory = 0    
    let color = object.parentElement.querySelector(".images").childNodes[0].id

   for(let i = 0 ; i <object.parentElement.querySelector(".dataInventory").childNodes.length ; i++){
        //console.log("ID PRODUCT=>",object.parentElement.querySelector(".dataInventory").childNodes[i].dataset.array_prod,object.parentElement.dataset.id);
        //console.log("TALLE=>",h.textContent,object.parentElement.querySelector(".dataInventory").childNodes[i+2].dataset.array_prod);
        //console.log("COLOR=>",color.toUpperCase() , object.parentElement.querySelector(".dataInventory").childNodes[i+1].dataset.array_prod);
       
        if(object.parentElement.querySelector(".dataInventory").childNodes[i].dataset.array_prod==object.parentElement.dataset.id &&   
        h.textContent==object.parentElement.querySelector(".dataInventory").childNodes[i+2].dataset.array_prod &&         
        color.toUpperCase() == object.parentElement.querySelector(".dataInventory").childNodes[i+1].dataset.array_prod){
            inventory = object.parentElement.querySelector(".dataInventory").childNodes[i+3].dataset.array_prod
        }
    }
    
    if(inventory<=0){
        show.style="color:#DF1212;"
        show.style.width= show.dataset.width +"px"
        show.textContent= "Sin Stock"
    }
    if(inventory >=1 && inventory <= 4){        
        show.style="color:rgb(204, 131, 78);"
        show.style.width= show.dataset.width +"px"
        show.textContent= "Pocas unidades"
    }
    if(inventory > 4){         
        show.style="color:#2CB812;"
        show.style.width= show.dataset.width +"px"
        show.textContent= "En stock"
    }

}


//carousel
const carousel = e=>{
    if (e.target.classList.contains('image')){
    carousel2(e.target)}
    e.stopPropagation(e.target.parentElement)
}
const carousel2 = e =>{

    const images = e.parentElement.parentElement.querySelector(".images")
    const prevBtn = e.parentElement.parentElement.parentElement.querySelector(".prev")
    const nextBtn = e.parentElement.parentElement.parentElement.querySelector(".next")
    prevBtn.addEventListener("click", prevSlide)
    nextBtn.addEventListener("click",nextSlide)
    const imageWidht = e.parentElement.parentElement.querySelector(".image").dataset.width
    let index = 0 
    let interval = setInterval(startInterval, 500)

    function startInterval(){
        index =+ 1
        moveCarrousel()
    } 

    function  moveCarrousel(){
        if (index > images.childNodes.length -1){
            index = 0 
        } else if (index < 0){
            index = images.childNodes.length -1
        }      
        images.style.transform = `translateX(-${index * imageWidht}px)`         
    }
    //Nav btn 
    function prevSlide (){
        index -- 
        resetInterval()
        moveCarrousel()
    }
    function nextSlide (){
        index ++
        resetInterval()
        moveCarrousel()
    }
    function resetInterval(){
        clearInterval(interval)
    }
}

//button shopping cart
const size = e => {
    if (e.target.classList.contains('size')){
        addtalle(e.target)}
     e.stopPropagation(e.target.parentElement)

}
const addtalle = e => {
    let object = e.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement
    let inventory = ''
    let price =''
    let title = '' 
    let color = object.querySelector(".images").childNodes[0].id
    
    for(let i = 0 ; i <object.querySelector(".dataInventory").childNodes.length ; i++){
        if(object.querySelector(".dataInventory").childNodes[i].dataset.array_prod==object.dataset.id && e.textContent == object.querySelector(".dataInventory").childNodes[i+2].dataset.array_prod && color.toUpperCase() == object.querySelector(".dataInventory").childNodes[i+1].dataset.array_prod){
            inventory = object.querySelector(".dataInventory").childNodes[i+3].dataset.array_prod
            price = object.querySelector(".dataInventory").childNodes[i+4].dataset.array_prod
            title = object.querySelector(".dataInventory").childNodes[i+5].dataset.array_prod
        }
    }    
    const product = {
        id_product: object.dataset.id,
        inventory_quantity: inventory,
        color: color,
        size: e.textContent,
        price: '$' + price,
        title : title
    } 
    console.log("agregado al carrito", product)
}

//change array images carousel
const scrollImages = e => {
    if (e.target.classList.contains('imagesContainer')) {
        setImagen(e.target, e.target.parentElement)
    }
    e.stopPropagation(e.target, e.target.parentElement)
}
const setImagen = (img, object) => {
    let data = object.parentElement.parentElement.querySelector('.srcImages')
    let array = []

    for (let i = 0; i < data.childNodes.length; i++) {
        let count = 0

        if (img.src == data.childNodes[i].dataset.img) {
            let flag = 0

            for (let j = i; j < (data.childNodes.length); j++) {
                if (data.childNodes[j].dataset.img == 'stop' && flag != 1) {
                    flag = 1
                    count = j
                }
            }
            for (let m = i; m < count; m++){
                array.push(data.childNodes[m].dataset.img,)
            }
        }
    }

    object.parentElement.parentElement.querySelector(".images").innerHTML = ''
    for (let i =0 ; i <array.length; i++) {
        var element = document.createElement("img")
        element.setAttribute("src",array[i] )
        element.className = "image"
        element.style.width = array[i+1]*0.19+"px"
        element.style.height = array[i+2]*0.19+"px"
        element.setAttribute("id",img.id)
        object.parentElement.parentElement.querySelector(".images").appendChild(element) 
        i = i+2
    }
}

//agrega a favoritos 
const favFunction = e => {
    if (e.target.classList.contains('material-symbols-outlined')) {
        favorite(e.target.parentElement)
    }
    e.stopPropagation(e.target.parentElement)
}
 const favorite = object => {
    const fav1 = object.querySelector('.full-icon')
    fav1.style="display:content;"
    const fav2 = object.querySelector('#fav')
    fav2.style = "display:none;"



    const id = object.querySelector('#fav').dataset.id;

    const favoriteAlert = document.querySelector(".favoriteAlert")
    favoriteAlert.textContent= "¡ Agregado a favoritos !"
    favoriteAlert.style="display:flex;"
    console.log("Agregado a favoritos ID nro:", id)
} 

