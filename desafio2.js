
import fs from 'fs/promises'


class ProductManager {
    constructor(path) {
        this.path = path
        this.unique_id = 1;
    }

    async loadFile() {
        const json = await fs.readFile(this.path, 'utf-8');         
        return JSON.parse(json);                                     
    }

    async saveFile(allProducts) {
        const json = JSON.stringify(allProducts, null, 2)
        await fs.writeFile(this.path, json)
    }

    async getProducts() {
        await this.loadFile()
        console.log(await this.loadFile())
    }

    async createProduct(title, description, price, thumbnail, code, stock){
            
        let producto = {
            id : this.unique_id ++,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
            }       
    
        const allProducts = await this.loadFile()

         if (allProducts.length === 0){
            allProducts.push(producto);
         }  else {                                  
            const finder = allProducts.find(( i => i.code === code));
            if (finder){
                console.log('Error. producto duplicado')
            }  else  {
                allProducts.push(producto);    
            }
         }
        await this.saveFile(allProducts);
        return producto;
        
    
        }
    async getProductByID(id){
        const allProducts = await this.loadFile();
        const found = allProducts.find((i => i.id === id));
        if (found){
        console.log(found)
        }  else  {
        console.log('File not found');
        }
    }   

    async updateProduct(newProduct){
        const allProducts = await this.loadFile();
        const upd = allProducts.findIndex( pr => pr.id === newProduct.id)
        if(upd >= 0){
            allProducts[upd] = newProduct;
            await this.saveFile(allProducts);
        } else {
            console.log('El producto a actualizar no existe')
        }
    }

    async deleteProduct(id){

        const allProducts = await this.loadFile();
        
        const byeProduct = allProducts.findIndex( pr => pr.id === id)
        if(byeProduct >= 0){
            allProducts.splice(byeProduct, 1);
            await this.saveFile(allProducts);
        
        } else {
            console.log('El producto no existe')
        }
    }
}

const productos = new ProductManager('./products.txt')


await productos.getProducts()
await productos.createProduct("producto prueba", 'este es un producto de prueba', 200, 'Sin imagen', 'ab23', 25)
await productos.getProducts()

await productos.createProduct("producto prueba", 'este es un producto de prueba', 200, 'imagen', 'abc23', 25)
await productos.getProducts()

await productos.getProductByID(2);

await productos.deleteProduct(2);

await productos.getProducts()

await productos.updateProduct({id: 1, title:'nuevo producto', description:'Esto es un nuevo producto', price:300, thumbnail:'producto sin imagen', code:'JSBK23', stock:45})

await productos.getProducts()
