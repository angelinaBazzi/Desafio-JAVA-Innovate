/* fetch('/products.json')

  .then(response => response.json())

   .then(data => {

        console.log(data.products)
        const container = document.getElementById('card__scroll')

        const container1 = document.getElementById('card__title')

        for ( let i=0; i <  data.products.length; i++){
          for (let m=0; m < data.products.length; m++)
            console.log("i="+ i)
            const title = data.products[i].title
            const price = data.products[i].variants[0].price
            const tit_variant = data.products[i].variants[0].title
            const variants_color = data.products[i].options[0].values
            console.log('tittle =>', title)
            console.log('price =>', price)  
            const template = `<li>PRODUCT => ${[i]}</li><div>${"price=",price}</div><li>variantes del producto =>${[i]}</li><div>${"variantes titulo=",tit_variant}</div><div>${"opcion color=",variants_color}</div>`
            container.innerHTML = container.innerHTML + template  
            const template1 = `<div>${"titulo=",title}</div>`
            container1.innerHTML = container1.innerHTML + template1  


          }
          
        }
   
);


var app ={};
var miCallback = function (datos){

}

document.getElementById("card__scroll").innerHTML= */