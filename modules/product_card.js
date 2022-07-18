import { } from "./eventListener.js"

const products = document.getElementById('products')
const templateCard = document.getElementById('template-card').content
const fragment = document.createDocumentFragment()


//recibe los productos que debe mostrar
//arma cada product card 

export const card_product = data => {
    data.forEach((product, key , map) => {


        //carga los template 
        loadTemplate (product)

        //carga images al carrousel
        loadImagesCarousel (product)
        
        //tamaño del carrosel
        carouselWidht()

        //carga img variantes
        loadImagesVariants(product.options[0].values,product)

        //carga talles del product
        showSizes (product.options[1].values)
            
        
        //***************************************

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
    templateCard.querySelector(".slider").dataset.index = 0

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
}

function loadImagesCarousel (product) {
    for (let i = 0; i < product.images.length; i++) {
        var element = document.createElement("img")
        var elementDiv = document.createElement("div")
        element.dataset.position = product.images[i].position
        if (product.images[i].alt == null ) {
            color2=""
        }else{
            var color= product.images[i].alt.split("#")
            var color2 = color.pop().toUpperCase()
        }
        element.dataset.color = color2

        element.setAttribute("src", product.images[i].src)
        element.className = "image"
        
        elementDiv.style.width = "250px"
        
        elementDiv.appendChild(element)
        templateCard.querySelector(".images").appendChild(elementDiv)    

    }
    var color= product.images[0].alt.split("#")
    var color2 = color.pop().toUpperCase()
    templateCard.querySelector(".slider").dataset.color = color2
}

function loadImagesVariants(imagesColor,product){
    for (let a = 0; a < imagesColor.length; a++) {
        let colors = []

        for (let i = 0; i < product.images.length; i++) {
            if (product.images[i].alt != null){
                let cadena = product.images[i].alt
                let color = cadena.split('#')
                let color2 = color.pop().toUpperCase()
                if (imagesColor[a] == color2) {
                    colors.push(product.images[i],color2)                    
                }
            }
        }
        if(colors !=''){
            //agrega images de variantes de colores (images abajo)
            var foto = document.createElement("img")
            foto.setAttribute("src", colors[0].src)
            foto.className = "imagesContainer"
            foto.setAttribute("id", colors[1]);
            templateCard.querySelector('#fotos').appendChild(foto)
            dataInventory(colors,product)             
        }
    }
}

function dataInventory(colors,product){
    // arrayInventory contiene => (idProducto , color , size , cantidad , price ,titulo)
    var arrayInventory = []
    for (let i = 0; i < colors.length/2; i++) {
        for(let d=0;d<product.variants.length; d ++){
            if(colors[i].id == product.variants[d].image_id ){
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
}

function showSizes (sizes){
    var element = document.createElement("div")
    element.className = "inventoryQuantity"
    element.textContent = "Selecciona tu talle"
    templateCard.querySelector(".inventoryQuantity").appendChild(element)

    for (let i = 0; i < sizes.length; i++) {
        var element = document.createElement("div")
        element.textContent = sizes[i]
        element.className = "size"
        templateCard.querySelector(".size_product").appendChild(element)
    }
}

function carouselWidht(){
    var carousel =templateCard.querySelector('.carousel')
    carousel.style.width =  250 +"px"   
    //carousel.style.height = 330 + "px"  
}


