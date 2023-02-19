import { reactive } from "vue";
import { defineStore } from "pinia";

export const productStore = defineStore("counter", () => {
  const news = reactive([
    {
      title: "Secret wars",
      price: 1200,
      image:
        "https://i.pinimg.com/originals/38/00/2f/38002f67df2a00194a03661795a2e015.jpg",
      discount: 0,
      stock: 1,
    },
    {
      title: "X-Men",
      price: 1200,
      image:
        "https://hablandodecomics.files.wordpress.com/2012/01/portada-95-x-men.jpg?w=723",
      discount: 0,
      stock: 1,
    },
    {
      title: "Star wars",
      price: 1200,
      image:
        "https://ep00.epimg.net/elpais/imagenes/2015/03/10/album/1426006152_604012_1426006648_album_normal.jpg",
      discount: 0,
      stock: 1,
    },
    {
      title: "Hulk",
      price: 1200,
      image: "https://sobrecomic.com/wp-content/uploads/2009/06/1.jpg",
      discount: 0,
      stock: 1,
    },
    {
      title: "Iron Man",
      price: 1200,
      image:
        "https://i.pinimg.com/originals/3d/6b/5f/3d6b5f51337e755637832a49b216d1ea.jpg",
      discount: 0,
      stock: 1,
    },
    {
      title: "Ant-Man",
      price: 1200,
      image:
        "https://www.cuartomundo.cl/wp-content/uploads/2019/03/MARVEL-PREMIERE-47.jpg",
      discount: 0,
      stock: 1,
    },
  ]);

  const products = reactive([
    {
      title: "Secret wars",
      price: 1200,
      image:
        "https://i.pinimg.com/originals/38/00/2f/38002f67df2a00194a03661795a2e015.jpg",
      discount: 0,
      stock: 1,
    },
    {
      title: "X-Men",
      price: 1200,
      image:
        "https://hablandodecomics.files.wordpress.com/2012/01/portada-95-x-men.jpg?w=723",
      discount: 0,
      stock: 1,
    },
    {
      title: "The amazing spiderman",
      price: 1200,
      image:
        "https://www.cuartomundo.cl/wp-content/uploads/2019/03/amazing-spider-man-122.jpg",
      discount: 10,
      stock: 1,
    },
    {
      title: "The avengers",
      price: 1200,
      image:
        "https://gcdn.lanetaneta.com/wp-content/uploads/2022/01/Vengadores-las-10-portadas-mas-iconicas-de-todos-los-tiempos.5.jpeg",
      discount: 0,
      stock: 0,
    },
    {
      title: "The avengers",
      price: 1200,
      image: "https://www.sddistribuciones.com/Portadas/RDSRS033167.JPG",
      discount: 0,
      stock: 1,
    },
    {
      title: "Star wars",
      price: 1200,
      image:
        "https://ep00.epimg.net/elpais/imagenes/2015/03/10/album/1426006152_604012_1426006648_album_normal.jpg",
      discount: 0,
      stock: 1,
    },
    {
      title: "Hulk",
      price: 1200,
      image: "https://sobrecomic.com/wp-content/uploads/2009/06/1.jpg",
      discount: 0,
      stock: 1,
    },
    {
      title: "Iron Man",
      price: 1200,
      image:
        "https://i.pinimg.com/originals/3d/6b/5f/3d6b5f51337e755637832a49b216d1ea.jpg",
      discount: 0,
      stock: 1,
    },
    {
      title: "Ant-Man",
      price: 1200,
      image:
        "https://www.cuartomundo.cl/wp-content/uploads/2019/03/MARVEL-PREMIERE-47.jpg",
      discount: 0,
      stock: 1,
    },
    {
      title: "Secret wars",
      price: 1200,
      image:
        "https://i.pinimg.com/originals/38/00/2f/38002f67df2a00194a03661795a2e015.jpg",
      discount: 0,
      stock: 1,
    },
    {
      title: "X-Men",
      price: 1200,
      image:
        "https://hablandodecomics.files.wordpress.com/2012/01/portada-95-x-men.jpg?w=723",
      discount: 0,
      stock: 1,
    },
    {
      title: "The amazing spiderman",
      price: 1200,
      image:
        "https://www.cuartomundo.cl/wp-content/uploads/2019/03/amazing-spider-man-122.jpg",
      discount: 10,
      stock: 1,
    },
    {
      title: "The avengers",
      price: 1200,
      image:
        "https://gcdn.lanetaneta.com/wp-content/uploads/2022/01/Vengadores-las-10-portadas-mas-iconicas-de-todos-los-tiempos.5.jpeg",
      discount: 0,
      stock: 0,
    },
    {
      title: "The avengers",
      price: 1200,
      image: "https://www.sddistribuciones.com/Portadas/RDSRS033167.JPG",
      discount: 0,
      stock: 1,
    },
    {
      title: "Star wars",
      price: 1200,
      image:
        "https://ep00.epimg.net/elpais/imagenes/2015/03/10/album/1426006152_604012_1426006648_album_normal.jpg",
      discount: 0,
      stock: 1,
    },
    {
      title: "Hulk",
      price: 1200,
      image: "https://sobrecomic.com/wp-content/uploads/2009/06/1.jpg",
      discount: 0,
      stock: 1,
    },
    {
      title: "Iron Man",
      price: 1200,
      image:
        "https://i.pinimg.com/originals/3d/6b/5f/3d6b5f51337e755637832a49b216d1ea.jpg",
      discount: 0,
      stock: 1,
    },
    {
      title: "Ant-Man",
      price: 1200,
      image:
        "https://www.cuartomundo.cl/wp-content/uploads/2019/03/MARVEL-PREMIERE-47.jpg",
      discount: 0,
      stock: 1,
    },
    {
      title: "Secret wars",
      price: 1200,
      image:
        "https://i.pinimg.com/originals/38/00/2f/38002f67df2a00194a03661795a2e015.jpg",
      discount: 0,
      stock: 1,
    },
    {
      title: "X-Men",
      price: 1200,
      image:
        "https://hablandodecomics.files.wordpress.com/2012/01/portada-95-x-men.jpg?w=723",
      discount: 0,
      stock: 1,
    },
    {
      title: "The amazing spiderman",
      price: 1200,
      image:
        "https://www.cuartomundo.cl/wp-content/uploads/2019/03/amazing-spider-man-122.jpg",
      discount: 10,
      stock: 1,
    },
    {
      title: "The avengers",
      price: 1200,
      image:
        "https://gcdn.lanetaneta.com/wp-content/uploads/2022/01/Vengadores-las-10-portadas-mas-iconicas-de-todos-los-tiempos.5.jpeg",
      discount: 0,
      stock: 0,
    },
    {
      title: "The avengers",
      price: 1200,
      image: "https://www.sddistribuciones.com/Portadas/RDSRS033167.JPG",
      discount: 0,
      stock: 1,
    },
    {
      title: "Star wars",
      price: 1200,
      image:
        "https://ep00.epimg.net/elpais/imagenes/2015/03/10/album/1426006152_604012_1426006648_album_normal.jpg",
      discount: 0,
      stock: 1,
    },
    {
      title: "Hulk",
      price: 1200,
      image: "https://sobrecomic.com/wp-content/uploads/2009/06/1.jpg",
      discount: 0,
      stock: 1,
    },
    {
      title: "Iron Man",
      price: 1200,
      image:
        "https://i.pinimg.com/originals/3d/6b/5f/3d6b5f51337e755637832a49b216d1ea.jpg",
      discount: 0,
      stock: 1,
    },
    {
      title: "Ant-Man",
      price: 1200,
      image:
        "https://www.cuartomundo.cl/wp-content/uploads/2019/03/MARVEL-PREMIERE-47.jpg",
      discount: 0,
      stock: 1,
    },
    {
      title: "Secret wars",
      price: 1200,
      image:
        "https://i.pinimg.com/originals/38/00/2f/38002f67df2a00194a03661795a2e015.jpg",
      discount: 0,
      stock: 1,
    },
    {
      title: "X-Men",
      price: 1200,
      image:
        "https://hablandodecomics.files.wordpress.com/2012/01/portada-95-x-men.jpg?w=723",
      discount: 0,
      stock: 1,
    },
    {
      title: "The amazing spiderman",
      price: 1200,
      image:
        "https://www.cuartomundo.cl/wp-content/uploads/2019/03/amazing-spider-man-122.jpg",
      discount: 10,
      stock: 1,
    },
    {
      title: "The avengers",
      price: 1200,
      image:
        "https://gcdn.lanetaneta.com/wp-content/uploads/2022/01/Vengadores-las-10-portadas-mas-iconicas-de-todos-los-tiempos.5.jpeg",
      discount: 0,
      stock: 0,
    },
    {
      title: "The avengers",
      price: 1200,
      image: "https://www.sddistribuciones.com/Portadas/RDSRS033167.JPG",
      discount: 0,
      stock: 1,
    },
    {
      title: "Star wars",
      price: 1200,
      image:
        "https://ep00.epimg.net/elpais/imagenes/2015/03/10/album/1426006152_604012_1426006648_album_normal.jpg",
      discount: 0,
      stock: 1,
    },
    {
      title: "Hulk",
      price: 1200,
      image: "https://sobrecomic.com/wp-content/uploads/2009/06/1.jpg",
      discount: 0,
      stock: 1,
    },
    {
      title: "Iron Man",
      price: 1200,
      image:
        "https://i.pinimg.com/originals/3d/6b/5f/3d6b5f51337e755637832a49b216d1ea.jpg",
      discount: 0,
      stock: 1,
    },
    {
      title: "Ant-Man",
      price: 1200,
      image:
        "https://www.cuartomundo.cl/wp-content/uploads/2019/03/MARVEL-PREMIERE-47.jpg",
      discount: 35,
      stock: 1,
    },
    {
      title: "Secret wars",
      price: 1200,
      image:
        "https://i.pinimg.com/originals/38/00/2f/38002f67df2a00194a03661795a2e015.jpg",
      discount: 0,
      stock: 1,
    },
    {
      title: "X-Men",
      price: 1200,
      image:
        "https://hablandodecomics.files.wordpress.com/2012/01/portada-95-x-men.jpg?w=723",
      discount: 0,
      stock: 0,
    },
    {
      title: "The amazing spiderman",
      price: 1200,
      image:
        "https://www.cuartomundo.cl/wp-content/uploads/2019/03/amazing-spider-man-122.jpg",
      discount: 10,
      stock: 1,
    },
    {
      title: "The avengers",
      price: 1200,
      image:
        "https://gcdn.lanetaneta.com/wp-content/uploads/2022/01/Vengadores-las-10-portadas-mas-iconicas-de-todos-los-tiempos.5.jpeg",
      discount: 0,
      stock: 0,
    },
    {
      title: "The avengers",
      price: 1200,
      image: "https://www.sddistribuciones.com/Portadas/RDSRS033167.JPG",
      discount: 0,
      stock: 1,
    },
    {
      title: "Star wars",
      price: 1200,
      image:
        "https://ep00.epimg.net/elpais/imagenes/2015/03/10/album/1426006152_604012_1426006648_album_normal.jpg",
      discount: 0,
      stock: 1,
    },
    {
      title: "Hulk",
      price: 1200,
      image: "https://sobrecomic.com/wp-content/uploads/2009/06/1.jpg",
      discount: 50,
      stock: 1,
    },
    {
      title: "Iron Man",
      price: 1200,
      image:
        "https://i.pinimg.com/originals/3d/6b/5f/3d6b5f51337e755637832a49b216d1ea.jpg",
      discount: 0,
      stock: 1,
    },
    {
      title: "Ant-Man",
      price: 1200,
      image:
        "https://www.cuartomundo.cl/wp-content/uploads/2019/03/MARVEL-PREMIERE-47.jpg",
      discount: 0,
      stock: 1,
    },
  ]);

  const preSale = reactive([
    {
      title: "Ms. Marvel",
      price: 1500,
      image:
        "https://www.cuartomundo.cl/wp-content/uploads/2019/03/ms.-marvel-1.jpg",
      discount: 0,
      stock: 1,
    },
    {
      title: "X-Monsters",
      price: 1500,
      image:
        "https://i0.wp.com/www.lacasadeel.net/wp-content/uploads/2020/09/8-1.jpg?resize=520%2C790&ssl=1",
      discount: 0,
      stock: 1,
    },
  ]);

  return { news, products, preSale };
});
