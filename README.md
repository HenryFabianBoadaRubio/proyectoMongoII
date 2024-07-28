## Proyecto: CineCampus

### Problemática

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

### Método de uso:

```javascript
let objPelicula;
objPelicula= new pelicula();

console.log(await objPelicula.getAllMoviesProjection());
objPelicula.destructor();

```




### Ejemplo búsqueda exitosa:

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

Método para obtener la información detallada de una pelicula existente o en su defecto informar si la pelicula consultada no existe en la base de datos.

### Usuarios que pueden utilizar este método:

este método puede ser usado por todos los usuarios (admin, VIP y user )

**Parámetros:**

- `id `(ObjectId): El identificador único de la película.

**Retorno:**

- `Promise<Array>`: Una promesa que se resuelve en un array de objetos. El array contendrá un solo objeto que representa la película con información detallada si la película existe, o un array vacío si no se encuentra.

**Errores:**

- `Error`: Lanza un error si ocurre algún problema durante la conexión a la base de datos o durante la ejecución de la operación de agregación.

### Método de uso: 

Como parámetro se ingresa el Id de la pelicula a consultar.

```javascript
let objPelicula;
objPelicula= new pelicula();

console.log(await objPelicula.getAllMovieInformation(new ObjectId("66a12e9a1219e115c8e79e89")));
objPelicula.destructor();

```



### Ejemplo búsqueda exitosa:

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

## 2)Comprar Boletos:

### registerBuyTicket():

Método para la compra de un boleto nuevo ingresando asientos, pelicula y método de pago.

### Usuarios que pueden utilizar este método:

este método puede ser usado por todos los usuarios (admin, VIP y user )

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

### Método de uso: 

Como parámetro se ingresa id(pelicula, proyección, usuario , asientos que desea y método de pago.)

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

### Ejemplo búsqueda exitosa:

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

## 2.1Verificar Disponibilidad de Asientos:

### getAvailableSeats():

Método para conocer la disponibilidad de asientos en una sala dependiendo la proyección.

### Usuarios que pueden utilizar este método:

este método puede ser usado por todos los usuarios (admin, VIP y user )

#### Parámetros:

- `params` (Object): Un objeto que contiene los parámetros necesarios para ejecutar la función.
- `proyeccion_id` (string): El identificador único de la proyección para la cual se desean consultar los asientos disponibles.

#### Retorno:

- `Object`: El resultado de la operación, que incluye:
- `Array `asientosDisponibles`: Un array de strings, cada uno representando un asiento disponible en el formato 'filaNumero'. Esto proporciona a los usuarios una lista clara de los asientos que aún están desocupados y disponibles para su selección.
- `Object error`: Un objeto de error que se devuelve en caso de que la operación falle. Este objeto contiene:
- `message` (string): Un mensaje descriptivo que detalla la naturaleza del error ocurrido.

### Método de uso: 

```javascript
let objBoleto;
objBoleto= new boleto()
console.log(await objBoleto.getAvailableSeats({proyeccion_id:
                                               "66a12e9b1219e115c8e79e95"}));
objBoleto.destructor();
```

### Ejemplo búsqueda exitosa:

```javascript
Conexion realizada correctamente
{ asientosDisponibles: [ ' A2', ' A3' ] }

```

### Ejemplos error:

```javascript
Conexion realizada correctamente
{
  error: 'Not found',
  message: 'La proyección con id 11a12e9b1219e115c8e79e95 no existe.'
}

```

## **Asignación de Asientos:**

## 3)Reservar Asientos:

### reserveSeats():

Método para realizar la reserva de asientos validando la proyección.

#### Parámetros:

- `params `(Object): Un objeto que contiene los parámetros necesarios para realizar la reserva.
- `proyeccion_id` (string): El identificador único de la proyección para la cual se desea hacer la reserva.
- `usuario_id` (string): El identificador único del usuario que realiza la reserva.
- `asientos` (Array): Un array de objetos, cada uno representando un asiento a reservar con las propiedades:
- `fila `(string): La fila del asiento.
- `numero` (string): El número del asiento dentro de la fila.

#### Retorno:

- `Object`: El resultado de la operación de reserva, que incluye:
- `string `message: Un mensaje que indica si la operación fue exitosa o si hubo un error.
- `string `boleto_id:El identificador único del boleto creado para la reserva, si la operación fue exitosa.
- `string `descuento: El descuento aplicado a la reserva, en caso de que el usuario sea elegible para un descuento VIP.
- `Object `error: Un objeto de error que se devuelve en caso de que la operación falle, que contiene:
- `string `message: Un mensaje descriptivo del error ocurrido.
- `Object `details: Información adicional que detalla el motivo del error.

### Método de uso: 

```javascript
let objBoleto;
objBoleto= new boleto()

console.log(await objBoleto.reserveSeats({
    proyeccion_id:"66a12e9b1219e115c8e79e99",
    usuario_id: "66a12e9b1219e115c8e79e9e",
    asientos: [{fila: "C", numero: 2},{fila: "C", numero: 1}],
    
}));
objBoleto.destructor();

```

### Ejemplo búsqueda exitosa:

```javascript
Conexion realizada correctamente
{
  message: 'Boleto reservado correctamente.',
  boleto_id: new ObjectId('66a6c0216ff2b6904d25bf72'),
  descuento: 'Descuento aplicado: 30'
}
```

### Ejemplos error:

```javascript
Conexion realizada correctamente
{
  error: 'Not found',
  message: 'el asiento no está disponible O no existe. ',
  asiento: { fila: 'X', numero: 2 }
}
```

