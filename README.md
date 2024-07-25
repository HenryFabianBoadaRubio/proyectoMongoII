## Proyecto: CineCampus

### Problemtica

CineCampus es una empresa de entretenimiento que se especializa en ofrecer una experiencia de cine completa y personalizada. La empresa desea desarrollar una aplicación web que permita a los usuarios seleccionar películas, comprar boletos y asignar asientos de manera eficiente y cómoda. La aplicación también ofrecerá opciones de descuento para usuarios con tarjeta VIP y permitirá realizar compras en línea.

## Selección de Películas:  

## 1) Listar Películas:

### getAllMoviesProjection():

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


## 1.1) Obtener Detalles de Película:

### getAllMovieInformation():

Metodo para obtener la informacion detallada de una pelicula existente o en su defecto informar si la pelicula consultada no existe en la base de datos.

### Usuarios que pueden utiizar este metodo:

este metodo puede ser usado por todos los usuarios (admin, VIP y user )

**Parámetros:**

- **id (ObjectId)**: El identificador único de la película.

**Retorno:**

- **Promise<Array>**: Una promesa que se resuelve en un array de objetos. El array contendrá un solo objeto que representa la película con información detallada si la película existe, o un array vacío si no se encuentra.

**Errores:**

- **Error**: Lanza un error si ocurre algún problema durante la conexión a la base de datos o durante la ejecución de la operación de agregación.

### Metodo de uso:

Se crea una instancia de la clase `Pelicula` utilizando la siguiente sintaxis: 

`let objPelicula;`

` objPelicula= new pelicula();`

A continuación, se llama al método `getAllMovieInformation()` de la instancia creada. Este método es asíncrono, por lo que se utiliza `await` para esperar a que la promesa devuelta por el método se resuelva antes de continuar con la ejecución del código. El uso de `await` garantiza que se obtengan todos los datos de las películas antes de proceder. El siguiente código muestra cómo se realiza esta operación:

`console.log(await objPelicula.getAllMovieInformation(new ObjectId("66a12e9a1219e115c8e79e89")));`

se pasa un parámetro al método, en este caso, un identificador único de película (`ObjectId`), para obtener la información detallada de una película específica.

### Ejemplo busqueda exitosa:

```javascript
[
  {
    _id: new ObjectId('66a12e9a1219e115c8e79e89'),
    titulo: 'Dune: Part Two',
    genero: 'Ciencia Ficción',
    duracion: 166,
    actores: [ 'Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson' ],
    sinopsis: 'Paul Atreides se une a los Fremen en un viaje de venganza contra los conspiradores que destruyeron a su familia.'
  }
]
```

### Ejemplo error:

```javascript

{ error: 'Not found', message: 'La pelicula no existe.' }
Completed running 'main.js'
```

