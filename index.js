
import{products_per_page} from "./products_per_page.js";


let allProducts = ''

//Es disparado cuando el documento HTML se cargo completamente 
document.addEventListener('DOMContentLoaded', () => {
    fetchData()
})

// Trae los productos del .json
const fetchData = async () => {
    try {
        const res = await fetch('./data/products.json')
        const data = await res.json()     
        allProducts= data.products
    }
    catch (error) {
        console.log(error)
    }   
     //***  carga products per page ****
     products_per_page(allProducts)
}



