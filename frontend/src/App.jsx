import { useEffect, useState } from "react";
import "./App.css";

function App() {
    const [tareas, setTareas] = useState([]);
    const [titulo, setTitulo] = useState("");

    const API_URL = "/api/tareas";

    const obtenerTareas = async () => {
        try {
            const respuesta = await fetch(API_URL);
            const datos = await respuesta.json();
            setTareas(datos);
        } catch (error) {
            console.error("Error al obtener tareas:", error);
        }
    };

    const agregarTarea = async (evento) => {
        evento.preventDefault();

        if (titulo.trim() === "") {
            return;
        }

        await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                titulo: titulo
            })
        });

        setTitulo("");
        obtenerTareas();
    };

    const cambiarEstado = async (tarea) => {
        await fetch(`${API_URL}/${tarea.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                titulo: tarea.titulo,
                completada: !tarea.completada
            })
        });

        obtenerTareas();
    };

    const eliminarTarea = async (id) => {
        await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        obtenerTareas();
    };

    useEffect(() => {
        obtenerTareas();
    }, []);

    return (
        <main className="contenedor">
            <h1>Lista de tareas</h1>

            <form onSubmit={agregarTarea}>
                <input
                    type="text"
                    placeholder="Escribe una actividad a realizar"
                    value={titulo}
                    onChange={(evento) => setTitulo(evento.target.value)}
                />

                <button type="submit">Agregar</button>
            </form>

            <section>
                {tareas.length === 0 ? (
                    <p>No hay tareas registradas.</p>
                ) : (
                    tareas.map((tarea) => (
                        <article key={tarea.id}>
                            <span
                                className={
                                    tarea.completada ? "completada" : ""
                                }
                            >
                                {tarea.titulo}
                            </span>

                            <button onClick={() => cambiarEstado(tarea)}>
                                {tarea.completada
                                    ? "Marcar pendiente"
                                    : "Completar"}
                            </button>

                            <button onClick={() => eliminarTarea(tarea.id)}>
                                Eliminar
                            </button>
                        </article>
                    ))
                )}
            </section>
        </main>
    );
}

export default App;