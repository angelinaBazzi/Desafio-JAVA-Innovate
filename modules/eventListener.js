// ***************************************************************** EVENTLISTENER  ****************************************************************************************// 
products.addEventListener("click", i => {
    favFunction(i)
    moveScroll(i)  //Mueve carrousel a imagen seleccionada 
    addShoppingCart(i) 
})

products.addEventListener("mouseover", i =>{
    hoverSize(i)
    carousel(i)// mueve carrousel
})


//---------------------Function --------------//

    // show inventory quantity per size
const hoverSize = h =>{
    if (h.target.classList.contains('size')){
        setInventory_quantity(h.target)
    }
        h.stopPropagation(h.target.parentElement)
}

const setInventory_quantity = h =>{
    let object = h.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement
    let show = object.querySelector(".inventoryQuantity")
    let inventory = 0    
    let color = object.dataset.color

   for(let i = 0 ; i <object.parentElement.querySelector(".dataInventory").childNodes.length ; i++){
        //console.log("ID PRODUCT=>",object.parentElement.querySelector(".dataInventory").childNodes[i].dataset.array_prod,object.parentElement.dataset.id);
        //console.log("TALLE=>",h.textContent,object.parentElement.querySelector(".dataInventory").childNodes[i+2].dataset.array_prod);
        //console.log("COLOR=>",color.toUpperCase() , object.parentElement.querySelector(".dataInventory").childNodes[i+1].dataset.array_prod);
        if(object.parentElement.querySelector(".dataInventory").childNodes[i].dataset.array_prod==object.dataset.id &&   
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
    if (e.target.classList.contains('controls')){
        carousel2(e.target)}
    e.stopPropagation(e.target.parentElement)
}
const carousel2 = e =>{    
    const images = e.parentElement.parentElement.parentElement.querySelector(".images")
    const prevBtn = e.parentElement.parentElement.parentElement.querySelector(".prev")
    const nextBtn = e.parentElement.parentElement.parentElement.querySelector(".next")
    
    let index = e.parentElement.parentElement.querySelector(".slider").dataset.index 
    let color = e.parentElement.parentElement.querySelector(".slider").dataset.color 
    if(images.childNodes.length!=1){
        prevBtn.style = "display:content;"
        nextBtn.style = "display:content;"
    }

    
    prevBtn.addEventListener("click", prevSlide)
    nextBtn.addEventListener("click",nextSlide)
    
    function  moveCarrousel(){
        if (index > images.childNodes.length -1){
            index = 0 
        } else if (index < 0){
            index = images.childNodes.length -1
        }             
        e.parentElement.parentElement.querySelector(".slider").dataset.index = index
        e.parentElement.parentElement.querySelector(".slider").dataset.color = color
        images.style.transform = `translateX(-${index * 250}px)`         
    }
    //Nav btn 
    function prevSlide (){
        index -- 
        moveCarrousel()
    }
    function nextSlide (){
        index ++
        moveCarrousel()
    }
}

    //button shopping cart
const addShoppingCart = e => {
    if (e.target.classList.contains('size')){
        addProduct(e.target)}
     e.stopPropagation(e.target.parentElement)

}
const addProduct = e => {
    let object = e.closest('.slider'),
        inventory = '',
        price ='',
        title = '' ,
        color = object.dataset.color;

    // [...object.querySelector('.dataInventory').children].forEach( elem => {

    // })

    for(let i = 0 ; i <object.querySelector(".dataInventory").childNodes.length ; i++){
        if(object.querySelector(".dataInventory").childNodes[i].dataset.array_prod==object.dataset.id && e.textContent == object.querySelector(".dataInventory").childNodes[i+2].dataset.array_prod &&color == object.querySelector(".dataInventory").childNodes[i+1].dataset.array_prod ){
            inventory = object.querySelector(".dataInventory").childNodes[i+3].dataset.array_prod
            price = object.querySelector(".dataInventory").childNodes[i+4].dataset.array_prod
            title = object.querySelector(".dataInventory").childNodes[i+5].dataset.array_prod
        }
    }    
    if (inventory >0 ){
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
}

    //change array images carousel
const moveScroll = e => {
    if (e.target.classList.contains('imagesContainer')) {
        setImagen(e.target, e.target.parentElement)
    }
    e.stopPropagation(e.target, e.target.parentElement)
}
const setImagen = (img, object) => {
    let idColor = img.id,
        find= "no";
    object.parentElement.parentElement.querySelector(".images").childNodes.forEach( i =>{
        if(i.querySelector(".image").dataset.color.includes(idColor)&& find == "no"){
        find = "yes";
        moveCarrousel2(idColor,i.querySelector(".image").dataset.position,object.parentElement.parentElement.querySelector(".images"))
        }
        
    })
}

function moveCarrousel2(color,index,images){
    let ind = index-1 
    images.parentElement.dataset.index= ind
    images.parentElement.dataset.color= color
    images.style.transform = `translateX(-${ind * 250}px)`      
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
    const id = fav2.dataset.id;
    const favoriteAlert = document.querySelector(".favoriteAlert")
    favoriteAlert.textContent= "¡ Agregado a favoritos !"
    favoriteAlert.style="display:flex;"
    console.log("Agregado a favoritos ID nro:", id)
    setTimeout(function(){
        favoriteAlert.style = "display:none"
    }, 2000);
} 