const products = document.getElementById('products')
const templateCard = document.getElementById('template-card').content
const fragment = document.createDocumentFragment()
const alt = /^(#g)?\s?([a-zA-Z0-9]{1,25})\s?([a-zA-Z0-9]{1,25})?\s?([a-zA-Z0-9]{1,25})?\s?([a-zA-Z0-9]{1,25})?\s?([a-zA-Z0-9]{1,25})?\s?([a-zA-Z0-9]{1,25})?\s?#?([a-zA-Z0-9]{1,25})$/ //expresion regular de "alt"
let imagenesColor = []
var cont = 0 

//Es disparado cuando el documento HTML se cargo completamente 
document.addEventListener('DOMContentLoaded', () => {
    fetchData()
})

// Trae los productos del .json
const fetchData = async () => {
    try {
        const res = await fetch('products.json')
        const data = await res.json()
        pintarCards(data.products)
    }
    catch (error) {
        console.log(error)
    }
}

// arma cada product card 
const pintarCards = data => {

    data.forEach(product => {
        templateCard.querySelector('.description').textContent = product.body_html
        templateCard.querySelector('#fav').dataset.id = product.id
        templateCard.querySelector(".carousel").dataset.id = product.id
        templateCard.querySelector(".price").textContent = "$"+ product.variants[0].price// ****************** VER ********************
        let imagesColor = []
        let imagesSize = []
        let flag_color = 0
        let flag_size = 0
        arraydata = []


        //array donde se guardan las opciones de colores  y de talles 
        if (product.options != null) {
            var contador = 0
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
        //valida las opciones X talle y color ************************************************************* VER ************************************************************
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
    
        for (a = 0; a < imagesColor.length; a++) {
            let imgColor = []
            for (let i = 0; i < product.images.length; i++) {
                let cadena = product.images[i].alt
                let color = alt.exec(cadena)[8]
                if (imagesColor[a] == color.toUpperCase()) {
                    imgColor.push(product.images[i])
                }
            }
            var foto = document.createElement("img")
            foto.setAttribute("src", imgColor[0].src)
            foto.className = "imagesContainer"
            templateCard.querySelector('#fotos').appendChild(foto)
            if (flag != 1) {
                for (i = 0; i < imgColor.length; i++) {
                    var element = document.createElement("img")
                    element.setAttribute("src", imgColor[i].src)
                    element.dataset.id = imgColor[i].id
                    element.className = "image"
                    
        element.style.width ="800px"
        element.style.height ="600px"
                    templateCard.querySelector(".images").appendChild(element)
                }
            }
            for (i = 0; i < imgColor.length; i++) {
                var element = document.createElement("img")
                element.setAttribute("src", imgColor[i].src)
                element.dataset.id = imgColor[i].id
                element.className = "image"
                arraydata.push(element.src)
            }
            flag = 1
            arraydata.push('stop')
        }
        templateCard.querySelector(".data").innerHTML = ''

        for (i = 0; i < arraydata.length; i++) {
            var element = document.createElement("img")
            element.dataset.img = arraydata[i]
            templateCard.querySelector('.data').appendChild(element)
        }

        //carga talles
        templateCard.querySelector(".talles").innerHTML = ''
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
    carousel(i)
    
})

products.addEventListener("hover", i=>{
    console.log(i);
})

document.addEventListener("click", i =>{
    document.querySelector(".favoriteAlert").style = "display:none;"
})


const carousel = e=>{
    if (e.target.classList.contains('image')){
    carousel2(e.target)}
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
        if (index> images.childNodes.length -1){
            index = 0 
        } else if (index < 0){
            index = images.childNodes.length -1
        }
        images.style.transform = `translateX(-${index * 450}px)`
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
    if (e.target.classList.contains('talle'))
        addtalle(e.target)
}

const addtalle = e => {
    let object = e.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement

    const product = {
        id_product: object.dataset.id,
        id_variant: "",//??
        talle: e.textContent,
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
    let data = object.parentElement.parentElement.querySelector('.data')
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
        element.style.width ="800px"
        element.style.height ="600px"

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
    console.log("id nro:", id)
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