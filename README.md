## Proyecto: CineCampus

### Problemtica

CineCampus es una empresa de entretenimiento que se especializa en ofrecer una experiencia de cine completa y personalizada. La empresa desea desarrollar una aplicación web que permita a los usuarios seleccionar películas, comprar boletos y asignar asientos de manera eficiente y cómoda. La aplicación también ofrecerá opciones de descuento para usuarios con tarjeta VIP y permitirá realizar compras en línea.

### Requisitos Funcionales

### 1) Selección de Películas:

# getAllMoviesProjection():

Este método recupera todas las películas disponibles junto con sus horarios de proyección y la información relacionada con la sala de cine donde se proyectan.

### Usuarios que pueden utiizar este metodo:
este metodo puede ser usado por todos los usuarios (admin, VIP y user )
### Retorno:

Promise<Array>: Una promesa que se resuelve en un array de objetos. Cada objeto representa una película e incluye detalles de sus proyecciones y la información de la sala.
Errores:

### Error:

 Lanza un error si ocurre algún problema durante la conexión a la base de datos o durante la ejecución de la operación de agregación.

### Metodo de uso:

Se crea una instancia de la clase `Pelicula` utilizando la siguiente sintaxis: 

`let objPelicula;`

` objPelicula= new pelicula();`

A continuación, se llama al método `getAllMoviesProjection()` de la instancia creada. Este método es asíncrono, por lo que se utiliza `await` para esperar a que la promesa devuelta por el método se resuelva antes de continuar con la ejecución del código. El uso de `await` asegura que se obtengan todos los datos de las películas antes de proceder  .`console.log(await objPelicula.getAllMoviesProjection());`


### Ejemplo busqueda exitosa:

  ```javascript
  [{
    _id: new ObjectId('66a12e9a1219e115c8e79e8a'),
    titulo: 'Furiosa: A Mad Max Saga',
    genero: 'Acción',
    duracion: 150,
    proyecciones: [ [Object] ]
  },
  {
    _id: new ObjectId('66a12e9a1219e115c8e79e8d'),
    titulo: 'Joker: Folie à Deux',
    genero: 'Drama/Crimen',
    duracion: 150,
    proyecciones: [ [Object] ]
  }
] 
  ```


### Ejemplo error:
```javascript
[{
    return { 
        error: "Error", 
        message: error.message,
        details: error.errInfo};

}]
```


### 2) Compra de Boletos:

### getAllMovieInformation():

