import { useEffect, useState } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import { useNavigate } from 'react-router-dom'

export default function Ordenes() {
    const [ordenes, setOrdenes] = useState([])
    const [cargando, setCargando] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        if (!localStorage.getItem('usuarioId')) {
            navigate('/')
        }
        cargarOrdenes()
    }, [])

    async function cargarOrdenes() {
        const usuarioId = localStorage.getItem('usuarioId')
        const ordenesRef = collection(db, 'ordenes')
        const q = query(ordenesRef, where('usuarioId', '==', usuarioId))
        const resultado = await getDocs(q)

        const lista = resultado.docs.map((doc) => ({
            id: doc.id,
            productos: JSON.parse(doc.data().productos),
        }))

        setOrdenes(lista)
        setCargando(false)
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#faf8fd' }}>

            {/* Header */}
            <header className="bg-white border-b px-8 py-5 flex justify-between items-center" style={{ borderColor: '#ede8f5' }}>
                <div>
                    <h1 className="text-xl font-light tracking-widest" style={{ color: '#2d2d2d' }}>🌸 BLOOM</h1>
                    <p className="text-xs" style={{ color: '#8a8a8a' }}>Arreglos Florales</p>
                </div>
                <button
                    onClick={() => navigate('/catalogo')}
                    className="text-sm px-5 py-2 rounded-xl border transition-all"
                    style={{ borderColor: '#c4b0e0', color: '#8b6bb1' }}
                >
                    ← Volver al catálogo
                </button>
            </header>

            <div className="max-w-3xl mx-auto px-8 py-12">
                <h2 className="text-3xl font-light tracking-widest mb-8 text-center" style={{ color: '#2d2d2d' }}>
                    Mis Órdenes
                </h2>

                {/* Cargando */}
                {cargando && (
                    <p className="text-center" style={{ color: '#8a8a8a' }}>Cargando órdenes...</p>
                )}

                {/* Sin órdenes */}
                {!cargando && ordenes.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-4xl mb-4">🌸</p>
                        <p style={{ color: '#8a8a8a' }}>Aún no tienes órdenes</p>
                        <button
                            onClick={() => navigate('/catalogo')}
                            className="mt-4 text-sm px-6 py-2 rounded-xl transition-all"
                            style={{ backgroundColor: '#8b6bb1', color: 'white' }}
                        >
                            Ver catálogo
                        </button>
                    </div>
                )}

                {/* Lista de órdenes */}
                {ordenes.map((orden, index) => {
                    const total = orden.productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0)

                    return (
                        <div key={orden.id} className="bg-white rounded-3xl border mb-6 overflow-hidden" style={{ borderColor: '#ede8f5' }}>

                            {/* Encabezado de orden */}
                            <div className="px-6 py-4 flex justify-between items-center" style={{ borderBottom: '1px solid #ede8f5' }}>
                                <p className="text-xs tracking-widest uppercase" style={{ color: '#8a8a8a' }}>
                                    Orden #{index + 1}
                                </p>
                                <p className="font-medium" style={{ color: '#8b6bb1' }}>
                                    Total: Q{total.toFixed(2)}
                                </p>
                            </div>

                            {/* Productos de la orden */}
                            {orden.productos.map((producto) => (
                                <div key={producto.id} className="flex items-center gap-4 px-6 py-4" style={{ borderBottom: '1px solid #ede8f5' }}>
                                    <img
                                        src={producto.imagen}
                                        alt={producto.nombre}
                                        className="w-16 h-16 object-cover rounded-xl"
                                    />
                                    <div className="flex-1">
                                        <p className="font-medium text-sm" style={{ color: '#2d2d2d' }}>{producto.nombre}</p>
                                        <p className="text-xs mt-1" style={{ color: '#8a8a8a' }}>
                                            Q{producto.precio} × {producto.cantidad}
                                        </p>
                                    </div>
                                    <p className="font-medium" style={{ color: '#8b6bb1' }}>
                                        Q{(producto.precio * producto.cantidad).toFixed(2)}
                                    </p>
                                </div>
                            ))}

                        </div>
                    )
                })}
            </div>
        </div>
    )
}