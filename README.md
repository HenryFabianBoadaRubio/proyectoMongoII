## Proyecto: CineCampus

### Problemtica

CineCampus es una empresa de entretenimiento que se especializa en ofrecer una experiencia de cine completa y personalizada. La empresa desea desarrollar una aplicación web que permita a los usuarios seleccionar películas, comprar boletos y asignar asientos de manera eficiente y cómoda. La aplicación también ofrecerá opciones de descuento para usuarios con tarjeta VIP y permitirá realizar compras en línea.

## Selección de Películas:  

## 1) Listar Películas:

### getAllMoviesProjection():

Este método recupera todas las películas disponibles junto con sus horarios de proyección y la información relacionada con la sala de cine donde se proyectan.

### Usuarios que pueden utiizar este metodo:
este metodo puede ser usado por todos los usuarios (admin, VIP y user )
#### Retorno:

- `Promise<Array>`: Este método retorna una promesa que, al resolverse, proporciona un array de objetos. Cada objeto en el array contiene detalles sobre una película, sus proyecciones asociadas, y la información relacionada con la sala de cine donde se proyectará.

#### Excepciones:

- `Error`: El método puede lanzar un error si ocurre algún problema durante la conexión a la base de datos o durante la ejecución de la operación de agregación. Esto asegura que cualquier problema en la recuperación de los datos sea manejado adecuadamente y pueda ser diagnosticado.

### Metodo de uso:

```javascript
let objPelicula;
objPelicula= new pelicula();

console.log(await objPelicula.getAllMoviesProjection());
objPelicula.destructor();

```




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

- `id `(ObjectId): El identificador único de la película.

**Retorno:**

- `Promise<Array>`: Una promesa que se resuelve en un array de objetos. El array contendrá un solo objeto que representa la película con información detallada si la película existe, o un array vacío si no se encuentra.

**Errores:**

- `Error`: Lanza un error si ocurre algún problema durante la conexión a la base de datos o durante la ejecución de la operación de agregación.

### Metodo de uso: 

Como parametro se ingresa el Id de la pelicula a consultar.

```javascript
let objPelicula;
objPelicula= new pelicula();

console.log(await objPelicula.getAllMovieInformation(new ObjectId("66a12e9a1219e115c8e79e89")));
objPelicula.destructor();

```



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

## **Compra de Boletos:**

## 2)Comprar Boletos:** 

### registerBuyTicket():

Metodo para la compra de un boleto nuevo ingresando asientos, pelicula y metodo de pago.

### Usuarios que pueden utiizar este metodo:

este metodo puede ser usado por todos los usuarios (admin, VIP y user )

#### Parámetros:

- `params`(Object): Objeto que contiene los parámetros necesarios para la compra de boletos.
- `pelicula_id`(string): Identificador único de la película.
- `proyeccion_id`(string): Identificador único de la proyección.
- `usuario_id` (string): Identificador único del usuario que realiza la compra.
- `asientos` (Array): Lista de objetos que representan los asientos a reservar, cada uno con las propiedades:
- `fila`(string): La fila del asiento.
- `numero` (number): El número del asiento.
- `metodo_pago` (string): El método de pago utilizado para la compra.

#### Retorno:

El método devuelve un objeto con los siguientes campos:

- `result.message` (string): Un mensaje que indica el éxito o el fracaso de la operación de compra de boletos.
- `result.boleto_id`(string): El identificador del nuevo boleto creado, si la compra es exitosa.
- `result.descuento`(string): Información sobre el descuento aplicado, si corresponde.
- `result.pago_registrado` (Object): Detalles del pago registrado.
- `result.error` (Object): Un objeto que contiene información de error, en caso de que la operación falle.
- `message` (string): Mensaje de error detallado.
- `details` (Object): Detalles adicionales sobre el error.

### Metodo de uso: 

Como parametro se ingresa id(pelicula, proyecion, usuario , asientos que desea y metodo de pago.)

```javascript
let objBoleto;
objBoleto= new boleto()

console.log(await objBoleto.registerBuyTicket({
    pelicula_id:"66a12e9a1219e115c8e79e89",
    proyeccion_id:"66a12e9b1219e115c8e79e95",
    usuario_id: "66a12e9b1219e115c8e79e9b",
    asientos: [{fila: "A", numero: 1}],
    metodo_pago: "tarjeta_debito",
}));
objBoleto.destructor();
```

### Ejemplo busqueda exitosa:

```javascript

Conexion realizada correctamente
{
  message: 'Boleto registrado correctamente.',
  boleto_id: new ObjectId('66a3d5c3f931befcdcc6cd63'),
  descuento: 'Descuento aplicado: 20',
  pago_registrado: {
    boleto_id: new ObjectId('66a3d5c3f931befcdcc6cd63'),
    metodo_pago: 'tarjeta_debito',
    fecha_pago: 2024-07-26T16:58:43.547Z,
    estado: 'completado',
    monto: 2080,
    _id: new ObjectId('66a3d5c3f931befcdcc6cd64')
  }
}
```

### Ejemplos error:

```
{
  error: 'Not found',
  message: 'el asiento no está disponible: ',
  asiento: { fila: 'A', numero: 1 }
}
------------------------------------------
{ error: 'Not found', message: 'La proyeccion no existe.' }
```

