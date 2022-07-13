const products = document.getElementById('products')
const templateCard = document.getElementById('template-card').content
const fragment = document.createDocumentFragment()


let btn_prev = document.getElementById("btn_prev")
let btn_next = document.getElementById("btn_next")
var cont = 0 
let index = 0 
let products_per_page = 4

function show(tuka){
    console.log(tuka);}

//Es disparado cuando el documento HTML se cargo completamente 
document.addEventListener('DOMContentLoaded', () => {
    fetchData()
})
let pro = ''
const proo = new Map();

// Trae los productos del .json
const fetchData = async () => {
    try {
        const res = await fetch('products.json')
        const data = await res.json()     
        pro= data.products
    }
    catch (error) {
        console.log(error)
    }   
    let page = 0      
    change(index)    
    document.querySelector(".card_product_info").textContent = "Mostrando " + products_per_page + " de " + pro.length + " productos."

    function change (ind,flag){
        proo.clear()
        if(ind >= 0){
            if(flag=="next"){
            page++}else{
                page--
            }

            for (let i = ind ; i< (ind+products_per_page) ; i++){
                proo.set(i,pro[i])
            }
            document.getElementById('products').innerHTML=''        
            
            if (index== 0){
                btn_prev.style = "opacity: 0.2;"
            }else{
                btn_prev.style = "opacity: 1;"
            }
        }
        card_product(proo) 
        setPage(page+2,Math.round(pro.length/products_per_page))
    }

    function setPage(p,np){
        document.querySelector(".nro_pages").textContent = p +" de "+ np 

    }


    //console.log(proo.size)
    //console.log("TUKI en 0",proo.get(0));
    
    
    btn_prev.addEventListener("click", i =>{
        index -=products_per_page   
        let flag ="prev"
        change(index,flag)
    })

    btn_next.addEventListener("click", i =>{
        index +=products_per_page
        let flag ="next"
        change(index,flag)
    })







}


// arma cada product card 
const card_product = data => {

    data.forEach((product, key , map) => {
        templateCard.querySelector('.description').textContent = product.body_html
        templateCard.querySelector('#fav').dataset.id = product.id
        templateCard.querySelector(".slider").dataset.id = product.id

        // por defecto muestra el precio de la primer variante 
        templateCard.querySelector(".price").textContent = "$"+ product.variants[0].price        
        templateCard.querySelector(".price_compare").innerHTML = ''
        
        if (product.variants[0].compare_at_price != null){
            templateCard.querySelector(".price_compare").textContent = "$"+ product.variants[0].compare_at_price
        }

        let imagesColor = []
        let imagesSize = []
        let flag_color = 0
        let flag_size = 0
        arraydata = []

        //array donde se guardan las opciones de colores  y de talles 
        if (product.options != null) {

            product.options.forEach(i => {
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


        //flags opciones X talle y color
        if (flag_color == 0) {
            console.log("No hay opciones de colores");
        }
        if (flag_size == 0) {
            console.log("No hay opciones de talles");
        }
        if (product.options == "") {
            console.log("no tiene opciones")
        }

        
        templateCard.querySelector("#fotos").innerHTML = ''
        templateCard.querySelector(".images").innerHTML = ''
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

                //agrega images abajo
                var foto = document.createElement("img")
                foto.setAttribute("src", imgColor[0].src)
                foto.className = "imagesContainer"

                foto.setAttribute("id", colores[1]);

                templateCard.querySelector('#fotos').appendChild(foto)
               
                // agrega primeras fotos por defecto del scroll 
                if (flag != 1) {
                    for (i = 0; i < imgColor.length; i++) {
                        var element = document.createElement("img")
                        element.setAttribute("src", imgColor[i].src)
                        element.className = "image"
                        element.style.height ="500px"
                        element.setAttribute("id", colores[1])                       
                        templateCard.querySelector(".images").appendChild(element)    
                        }   
                }




                // arrayInventory que contiene (idProducto , color , size , cantidad , price ,titulo)
                var arrayInventory = []

                for (i = 0; i < imgColor.length; i++) {
                    
                    arraydata.push(imgColor[i].src)
                    for(let d=0;d<product.variants.length; d ++){
                        if(imgColor[i].id == product.variants[d].image_id ){
                            arrayInventory.push(product.variants[d].product_id,product.variants[d].option1,product.variants[d].option2,product.variants[d].inventory_quantity,product.variants[d].price,product.variants[d].title)                         
                        }                       
                    }

                }   


                 //carga los datos del arrayInventory al dataset en ".dataInventory"
                arrayInventory.forEach( e =>{
                    let el = document.createElement("div")
                    el.dataset.array_prod = e
                    templateCard.querySelector('.dataInventory').appendChild(el)
                })               

                flag = 1
                arraydata.push('stop')
            }
        }

        templateCard.querySelector(".srcImages").innerHTML = ''

        // guarda los src de todas las imagenes del producto
        for (i = 0; i < arraydata.length; i++) {
            var element = document.createElement("img")
            element.dataset.img = arraydata[i]
            templateCard.querySelector('.srcImages').appendChild(element)
        }

        //carga talles

        
        templateCard.querySelector(".talles").innerHTML = ''
        
        var element = document.createElement("div")
        element.className = "inventoryQuantity"
        element.style = "margin-left:5px"
        element.textContent = "Selecciona tu talle"

        templateCard.querySelector(".talles").appendChild(element)

        for (i = 0; i < imagesSize.length; i++) {

            var element = document.createElement("div")
            element.textContent = imagesSize[i]
            element.className = "talle"
            templateCard.querySelector(".talles").appendChild(element)

        }
        

        //************************************************************************


        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
            
        })

    products.appendChild(fragment)
}



products.addEventListener("click", i => {
    favFunction(i)
    scrollImages(i)  //cambia imagenes por seleccion 
    size(i)
})

products.addEventListener("mouseover", i =>{
    hover(i)
    carousel(i)

})

const hover = h =>{
    if (h.target.classList.contains('talle')){

        setInventory_quantity(h.target)
    }
        h.stopPropagation(h.target.parentElement)
}

const setInventory_quantity = h =>{
    let object = h.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement
    let show = object.querySelector(".inventoryQuantity")
    let inventory = 0    
    let color = object.querySelector(".images").childNodes[0].id
    for(let i = 0 ; i <object.querySelector(".dataInventory").childNodes.length ; i++){
        if(object.querySelector(".dataInventory").childNodes[i].dataset.array_prod==object.dataset.id && h.textContent == object.querySelector(".dataInventory").childNodes[i+2].dataset.array_prod && color.toUpperCase() == object.querySelector(".dataInventory").childNodes[i+1].dataset.array_prod){
            inventory = object.querySelector(".dataInventory").childNodes[i+3].dataset.array_prod
        }
    }
    if(inventory<=0){
        show.style="color:#DF1212;margin-right:50px"
        show.textContent= "Sin Stock"

    }
    if(inventory >=1 && inventory <= 4){        
        show.style="color:rgb(204, 131, 78);margin-right:50px;"
        show.textContent= "Pocas unidades"

    }
    if(inventory > 4){         
        show.style="color:#2CB812;margin-right:50px"
        show.textContent= "En stock"
    }
}

document.addEventListener("click", i =>{
    document.querySelector(".favoriteAlert").style = "display:none;"
})


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

    let index = 0 
    let interval = setInterval(startInterval, 0500)

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
        images.style.transform = `translateX(-${index * 370}px)`     //*********************************************** VER */
    }
    //Nav btn 
    function prevSlide (){
        index -- 
        resetInterval()
        moveCarrousel()
     //   console.log(images.childNodes[index])
    }
    function nextSlide (){
        index ++
        resetInterval()
        moveCarrousel()
     //   console.log(images.childNodes[index])

    }
    function resetInterval(){
        clearInterval(interval)
    }
}

//boton carrito
const size = e => {
    if (e.target.classList.contains('talle')){
        addtalle(e.target)}
     e.stopPropagation(e.target.parentElement)

}

const addtalle = e => {
    let object = e.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement
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


//cambia imagen 
const scrollImages = e => {
    if (e.target.classList.contains('imagesContainer')) {
        setImagen(e.target, e.target.parentElement)
    }
    e.stopPropagation(e.target, e.target.parentElement)
}
const setImagen = (img, object) => {
    let data = object.parentElement.parentElement.querySelector('.srcImages')
    let array = []

    for (i = 0; i < data.childNodes.length; i++) {
        let count = 0

        if (img.src == data.childNodes[i].dataset.img) {
            let bandera = 0
            for (j = i; j < (data.childNodes.length); j++) {
                if (data.childNodes[j].dataset.img == 'stop' && bandera != 1) {
                    bandera = 1
                    count = j
                }
            }
            for (m = i; m < count; m++){
                array.push(data.childNodes[m].dataset.img)
            }
        }
    }

    object.parentElement.parentElement.querySelector(".images").innerHTML = ''
    array.forEach(j => {
        var element = document.createElement("img")
        element.setAttribute("src", j)
        element.className = "image"

        element.style.height ="500px"
        element.setAttribute("id",img.id)
        object.parentElement.parentElement.querySelector(".images").appendChild(element)
    })
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
    fav1.style="display:content"
    const fav2 = object.querySelector('#fav')
    fav2.style = "display:none"
    const id = object.querySelector('#fav').dataset.id;
    const favoriteAlert = document.querySelector(".favoriteAlert")
    favoriteAlert.textContent= "¡ Agregado a favoritos !"
    favoriteAlert.style="display:flex;"
    console.log("Agregado a favoritos ID nro:", id)
}

/* 
products.addEventListener('click',e =>{
    addCarrito(e)
})
//agrega al carrito 
const addCarrito = e =>{
    console.log(e.target.classList.contains('btn-dark'));
  if(e.target.classList.contains('btn-dark')){
        setShoppingCard(e.target.parentElement)
    }
   e.stopPropagation(e.target.parentElement)
}


const setShoppingCard = object => {
    const product ={
        id: object.querySelector('.card_button').dataset.id,
        cantidad : 1
    }
    if (shoppingCart.hasOwnProperty(product.id)){
        product.cantidad = shoppingCart[product.id].cantidad + 1
    }
    shoppingCart[product.id] = {...product}
    console.log("PRODUCT",product)
}

  */