import { useEffect, useState } from "react";
import "./App.css";

function App() {
    const [tareas, setTareas] = useState([]);
    const [titulo, setTitulo] = useState("");
    const [filtro, setFiltro] = useState("todas");
    const [idEditando, setIdEditando] = useState(null);
    const [tituloEditado, setTituloEditado] = useState("");

    const API_URL = "/api/tareas";

    const obtenerTareas = async () => {
        try {
            const respuesta = await fetch(API_URL);

            if (!respuesta.ok) {
                throw new Error("No se pudieron obtener las tareas");
            }

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

        try {
            const respuesta = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    titulo: titulo.trim()
                })
            });

            if (!respuesta.ok) {
                throw new Error("No se pudo agregar la tarea");
            }

            setTitulo("");
            obtenerTareas();
        } catch (error) {
            console.error("Error al agregar la tarea:", error);
        }
    };

    const cambiarEstado = async (tarea) => {
        try {
            const respuesta = await fetch(`${API_URL}/${tarea.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    titulo: tarea.titulo,
                    completada: !tarea.completada
                })
            });

            if (!respuesta.ok) {
                throw new Error("No se pudo cambiar el estado");
            }

            obtenerTareas();
        } catch (error) {
            console.error("Error al cambiar estado:", error);
        }
    };

    const comenzarEdicion = (tarea) => {
        setIdEditando(tarea.id);
        setTituloEditado(tarea.titulo);
    };

    const cancelarEdicion = () => {
        setIdEditando(null);
        setTituloEditado("");
    };

    const guardarEdicion = async (tarea) => {
        if (tituloEditado.trim() === "") {
            return;
        }

        try {
            const respuesta = await fetch(`${API_URL}/${tarea.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    titulo: tituloEditado.trim(),
                    completada: tarea.completada
                })
            });

            if (!respuesta.ok) {
                throw new Error("No se pudo editar la tarea");
            }

            cancelarEdicion();
            obtenerTareas();
        } catch (error) {
            console.error("Error al editar tarea:", error);
        }
    };

    const eliminarTarea = async (id) => {
        const confirmar = window.confirm(
            "¿Estás seguro de eliminar esta tarea?"
        );

        if (!confirmar) {
            return;
        }

        try {
            const respuesta = await fetch(`${API_URL}/${id}`, {
                method: "DELETE"
            });

            if (!respuesta.ok) {
                throw new Error("No se pudo eliminar la tarea");
            }

            obtenerTareas();
        } catch (error) {
            console.error("Error al eliminar tarea:", error);
        }
    };

    const tareasFiltradas = tareas.filter((tarea) => {
        if (filtro === "pendientes") {
            return !tarea.completada;
        }

        if (filtro === "completadas") {
            return tarea.completada;
        }

        return true;
    });

    const totalPendientes = tareas.filter(
        (tarea) => !tarea.completada
    ).length;

    const totalCompletadas = tareas.filter(
        (tarea) => tarea.completada
    ).length;

    const porcentaje =
        tareas.length === 0
            ? 0
            : Math.round((totalCompletadas / tareas.length) * 100);

    useEffect(() => {
        obtenerTareas();
    }, []);

    return (
    <main className="contenedor">
        <aside className="lateral">
            <h2>Mis tareas</h2>

            <div className="resumen-lateral">
                <p>
                    Total
                    <strong>{tareas.length}</strong>
                </p>

                <p>
                    Pendientes
                    <strong>{totalPendientes}</strong>
                </p>

                <p>
                    Completadas
                    <strong>{totalCompletadas}</strong>
                </p>
            </div>

            <h3>Filtros</h3>

            <button
                className={filtro === "todas" ? "activo" : ""}
                onClick={() => setFiltro("todas")}
            >
                Todas
            </button>

            <button
                className={filtro === "pendientes" ? "activo" : ""}
                onClick={() => setFiltro("pendientes")}
            >
                Pendientes
            </button>

            <button
                className={filtro === "completadas" ? "activo" : ""}
                onClick={() => setFiltro("completadas")}
            >
                Completadas
            </button>
        </aside>

        <section className="contenido">
            <h1>Lista de tareas</h1>

            <form onSubmit={agregarTarea}>
                <input
                    type="text"
                    placeholder="Escribe una actividad"
                    value={titulo}
                    onChange={(evento) => setTitulo(evento.target.value)}
                />

                <button type="submit">Agregar</button>
            </form>

            <section className="lista">
                {tareasFiltradas.length === 0 ? (
                    <p>No hay tareas en este filtro.</p>
                ) : (
                    tareasFiltradas.map((tarea) => (
                        <article key={tarea.id}>
                            {idEditando === tarea.id ? (
                                <input
                                    type="text"
                                    value={tituloEditado}
                                    onChange={(evento) =>
                                        setTituloEditado(evento.target.value)
                                    }
                                />
                            ) : (
                                <span
                                    className={
                                        tarea.completada ? "completada" : ""
                                    }
                                >
                                    {tarea.titulo}
                                </span>
                            )}

                            <div className="acciones">
                                {idEditando === tarea.id ? (
                                    <>
                                        <button
                                            onClick={() =>
                                                guardarEdicion(tarea)
                                            }
                                        >
                                            Guardar
                                        </button>

                                        <button onClick={cancelarEdicion}>
                                            Cancelar
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() =>
                                                cambiarEstado(tarea)
                                            }
                                        >
                                            {tarea.completada
                                                ? "Pendiente"
                                                : "Completar"}
                                        </button>

                                        <button
                                            onClick={() =>
                                                comenzarEdicion(tarea)
                                            }
                                        >
                                            Editar
                                        </button>

                                        <button
                                            className="eliminar"
                                            onClick={() =>
                                                eliminarTarea(tarea.id)
                                            }
                                        >
                                            Eliminar
                                        </button>
                                    </>
                                )}
                            </div>
                        </article>
                    ))
                )}
            </section>
        </section>
    </main>
);
}

export default App;
