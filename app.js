const products = document.getElementById('products')
const templateCard = document.getElementById('template-card').content
const fragment= document.createDocumentFragment()

let shoppingCart ={}

document.addEventListener('DOMContentLoaded',() =>{
    fetchData()
})

products.addEventListener('click',e =>{
    addCarrito(e)
})



const fetchData = async() =>{
    try{
        const res = await fetch('products.json')
        const  data = await res.json()
        console.log(data)
        pintarCards(data.products)
    }
    catch (error){
        console.log(error)
    }
} 

const pintarCards = data =>{
    data.forEach(producto =>{
        templateCard.querySelector('.card-description').textContent = producto.body_html
        templateCard.querySelector('.card-img-top').setAttribute("src",producto.image.src)
        templateCard.querySelector('.btn-dark').dataset.id = producto.id
        var image=[]
        var imagenes=[]
      
        producto.variants.forEach(vari =>{
            image.push(vari.image_id)
            templateCard.querySelector('.precio').textContent = vari.price

        })

        producto.images.forEach( img =>{
            imagenes.push(img.src)
        })
        
        
        for(let i=0;i<imagenes.length; i++){ 
            templateCard.querySelector('.one').setAttribute("src",imagenes[0])
            templateCard.querySelector('.two').setAttribute("src",imagenes[1]) 
            templateCard.querySelector('.three').setAttribute("src",imagenes[2])
         }

        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)  
        
    })
    products.appendChild(fragment)

}

const addCarrito = e =>{
    if(e.target.classList.contains('btn-dark')){
       setShoppingCard(e.target.parentElement)
    }
    e.stopPropagation(e.target.parentElement)
}

const setShoppingCard = object => {
    const product ={
        id: object.querySelector('.btn-dark').dataset.id,
        cantidad : 1
    }
    if (shoppingCart.hasOwnProperty(product.id)){
        product.cantidad = shoppingCart[product.id].cantidad + 1
    }
    shoppingCart[product.id] = {...product}
    console.log("PRODUCT",product)
}


