db = db.getSiblingDB("rpg_manager");

// ── 1. Leer un personaje (buscarPorId) ───────────────────────────────
// La clase viaja dentro del documento: no hace falta ningún JOIN.
db.personajes.findOne(
  { id_personaje: 2 },
  { _id: 0, inventario: 0, misiones: 0 }
);

// SALA B.1

// ── 2. El inventario de un personaje (listarInventario) ──────────────
// El inventario es un arreglo embebido: se pide solo ese campo.
// >>> SALA B.2 

db.personajes.findOne(
  { id_personaje: 1 },
  { _id: 0, nombre: 1, inventario: 1 }
);

// ── 3. ¿Se puede borrar a Thorgar? (eliminar) ────────────────────────
// combates guarda NOMBRES, no llaves foráneas: nada impide el borrado.
// >>> SALA B.3 
db.combates.countDocuments({
  $or: [
    { atacante: "Thorgar" },
    { defensor: "Thorgar" },
    { ganador: "Thorgar" }
  ]
});

// Esta línea SÍ funciona en MongoDB (cuidado: deja combates huérfanos):
// db.personajes.deleteOne({ id_personaje: 1 });

// ── 4. Sumar un ítem al inventario (agregarItem) ─────────────────────
// Paso 1: si ya lo tiene, $inc sobre ese elemento del arreglo.
const resultado = db.personajes.updateOne(
  { id_personaje: 7, "inventario.item": "Poción de vida" },
  { $inc: { "inventario.$.cantidad": 2 } }
);
// Paso 2: si no lo tenía, se copia del catálogo y se agrega con $push.
if (resultado.matchedCount === 0) {
  const delCatalogo = db.items.findOne({ nombre: "Poción de vida" });
  db.personajes.updateOne(
    { id_personaje: 7 },
    { $push: { inventario: { item: delCatalogo.nombre, tipo: delCatalogo.tipo,
                             valor: delCatalogo.valor, cantidad: 2 } } }
  );
}