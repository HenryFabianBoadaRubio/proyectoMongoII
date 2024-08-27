db.createRole({
    role: "estandar",
    privileges: [
        {
            resource: { db: "cineCampus", collection: "asiento" },
            actions: [
                "find",
				"update"
            ]
        },
                {
            resource: { db: "cineCampus", collection: "boleto" },
            actions: [
                "find",
                "insert",
                "remove",
                "update"
            ]
        },
                {
            resource: { db: "cineCampus", collection: "pago" },
            actions: [
                "find",
                "insert",
                "remove",
                "update"
            ]
        },
                {
            resource: { db: "cineCampus", collection: "pelicula" },
            actions: [
                "find"
            ]
        },
                {
            resource: { db: "cineCampus", collection: "proyeccion" },
            actions: [
                "find"
            ]
        },
        {
            resource: { db: "cineCampus", collection: "sala" },
            actions: [
                "find"
            ]
        },
        {
            resource: { db: "cineCampus", collection: "tarjetaVIP" },
            actions: [
                "find"
            ]
        },
        {
            resource: { db: "cineCampus", collection: "usuario" },
            actions: [
                "find"
            ]
        }
    ],
    roles: []
})