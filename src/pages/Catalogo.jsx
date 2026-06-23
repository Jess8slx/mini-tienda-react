import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import { useNavigate } from 'react-router-dom'

export default function Catalogo() {
    const [productos, setProductos] = useState([])
    const [cantidades, setCantidades] = useState({})
    const [carrito, setCarrito] = useState([])
    const navigate = useNavigate()

    // Si no hay sesión, regresar al login
    useEffect(() => {
        if (!localStorage.getItem('usuarioId')) {
            navigate('/')
        }
        cargarProductos()
    }, [])

    async function cargarProductos() {
        const productosRef = collection(db, 'productos')
        const resultado = await getDocs(productosRef)
        const lista = resultado.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }))
        setProductos(lista)
    }

    function cambiarCantidad(productoId, valor) {
        setCantidades({ ...cantidades, [productoId]: Number(valor) })
    }

    function agregarAlCarrito(producto) {
        const cantidad = cantidades[producto.id] || 1

        // Si ya está en el carrito, actualizar cantidad
        const existe = carrito.find((p) => p.id === producto.id)
        if (existe) {
            setCarrito(carrito.map((p) =>
                p.id === producto.id ? { ...p, cantidad } : p
            ))
        } else {
            setCarrito([...carrito, { ...producto, cantidad }])
        }
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#faf8fd' }}>

            {/* Header */}
            <header className="bg-white border-b px-8 py-5 flex justify-between items-center" style={{ borderColor: '#ede8f5' }}>
                <div>
                    <h1 className="text-xl font-light tracking-widest" style={{ color: '#2d2d2d' }}>🌸 BLOOM</h1>
                    <p className="text-xs" style={{ color: '#8a8a8a' }}>Arreglos Florales</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => navigate('/carrito')}
                        className="text-sm px-5 py-2 rounded-xl border transition-all"
                        style={{ borderColor: '#c4b0e0', color: '#8b6bb1' }}
                    >
                        🛒 Carrito {carrito.length > 0 && `(${carrito.length})`}
                    </button>
                    <button
                        onClick={() => navigate('/ordenes')}
                        className="text-sm px-5 py-2 rounded-xl border transition-all"
                        style={{ borderColor: '#c4b0e0', color: '#8b6bb1' }}
                    >
                        Mis órdenes
                    </button>
                    <button
                        onClick={() => { localStorage.removeItem('usuarioId'); navigate('/') }}
                        className="text-sm px-5 py-2 rounded-xl transition-all"
                        style={{ color: '#8a8a8a' }}
                    >
                        Salir
                    </button>
                </div>
            </header>

            {/* Título */}
            <div className="text-center py-12">
                <h2 className="text-3xl font-light tracking-widest" style={{ color: '#2d2d2d' }}>Catálogo</h2>
                <p className="text-sm mt-2" style={{ color: '#8a8a8a' }}>Elige tu ramo favorito</p>
            </div>

            {/* Grid de productos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 px-8 pb-16 max-w-8x1 mx-auto">
                {productos.map((producto) => (
                    <div key={producto.id} className="bg-white rounded-3xl border overflow-hidden shadow-sm transition-all hover:shadow-md" style={{ borderColor: '#ede8f5' }}>

                        {/* Imagen */}
                        <img
                            src={producto.imagen}
                            alt={producto.nombre}
                            className="w-full h-96 object-cover"
                        />

                        {/* Info */}
                        <div className="p-6">
                            <h3 className="font-medium text-base tracking-wide mb-1" style={{ color: '#2d2d2d' }}>
                                {producto.nombre}
                            </h3>
                            <p className="text-xl font-light mb-5" style={{ color: '#8b6bb1' }}>
                                Q{producto.precio}
                            </p>

                            {/* Cantidad */}
                            <div className="flex items-center gap-3 mb-4">
                                <label className="text-xs tracking-widest uppercase" style={{ color: '#8a8a8a' }}>Cantidad</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={cantidades[producto.id] || 1}
                                    onChange={(e) => cambiarCantidad(producto.id, e.target.value)}
                                    className="w-16 text-center text-sm py-1 rounded-lg border outline-none"
                                    style={{ borderColor: '#ede8f5' }}
                                />
                            </div>

                            {/* Botón agregar */}
                            <button
                                onClick={() => agregarAlCarrito(producto)}
                                className="w-full py-3 rounded-xl text-sm tracking-widest uppercase font-medium transition-all duration-200"
                                style={{ backgroundColor: '#8b6bb1', color: 'white' }}
                                onMouseEnter={e => e.target.style.backgroundColor = '#a088cc'}
                                onMouseLeave={e => e.target.style.backgroundColor = '#8b6bb1'}
                            >
                                Agregar al carrito
                            </button>

                        </div>
                    </div>
                ))}
            </div>

        </div>
    )
}