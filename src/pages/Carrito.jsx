import { useState } from 'react'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useNavigate } from 'react-router-dom'

export default function Carrito({ carrito, setCarrito }) {
    const [confirmacion, setConfirmacion] = useState(false)
    const [cargando, setCargando] = useState(false)
    const navigate = useNavigate()

    const total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0)

    async function ingresarOrden() {
        setCargando(true)
        const usuarioId = localStorage.getItem('usuarioId')

        await addDoc(collection(db, 'ordenes'), {
            productos: JSON.stringify(carrito),
            usuarioId: usuarioId
        })

        setCarrito([])
        setCargando(false)
        setConfirmacion(true)
    }

    function eliminarDelCarrito(productoId) {
        setCarrito(carrito.filter((p) => p.id !== productoId))
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

            <div className="max-w-2xl mx-auto px-8 py-12">
                <h2 className="text-3xl font-light tracking-widest mb-8 text-center" style={{ color: '#2d2d2d' }}>
                    Carrito
                </h2>

                {/* Mensaje de confirmación */}
                {confirmacion && (
                    <div className="text-center py-6 px-8 rounded-2xl mb-8" style={{ backgroundColor: '#ede8f5' }}>
                        <p className="text-2xl mb-2">🌸</p>
                        <p className="font-medium" style={{ color: '#8b6bb1' }}>¡Orden ingresada con éxito!</p>
                        <p className="text-sm mt-1" style={{ color: '#8a8a8a' }}>Tu pedido ha sido registrado</p>
                        <button
                            onClick={() => navigate('/ordenes')}
                            className="mt-4 text-sm px-6 py-2 rounded-xl transition-all"
                            style={{ backgroundColor: '#8b6bb1', color: 'white' }}
                        >
                            Ver mis órdenes
                        </button>
                    </div>
                )}

                {/* Carrito vacío */}
                {carrito.length === 0 && !confirmacion && (
                    <div className="text-center py-16">
                        <p className="text-4xl mb-4">🛒</p>
                        <p style={{ color: '#8a8a8a' }}>Tu carrito está vacío</p>
                        <button
                            onClick={() => navigate('/catalogo')}
                            className="mt-4 text-sm px-6 py-2 rounded-xl transition-all"
                            style={{ backgroundColor: '#8b6bb1', color: 'white' }}
                        >
                            Ver catálogo
                        </button>
                    </div>
                )}

                {/* Lista de productos */}
                {carrito.length > 0 && (
                    <>
                        <div className="bg-white rounded-3xl border overflow-hidden" style={{ borderColor: '#ede8f5' }}>
                            {carrito.map((producto, index) => (
                                <div
                                    key={producto.id}
                                    className="flex items-center gap-4 px-6 py-4"
                                    style={{ borderBottom: index < carrito.length - 1 ? '1px solid #ede8f5' : 'none' }}
                                >
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
                                    <div className="flex flex-col items-end gap-2">
                                        <p className="font-medium" style={{ color: '#8b6bb1' }}>
                                            Q{(producto.precio * producto.cantidad).toFixed(2)}
                                        </p>
                                        <button
                                            onClick={() => eliminarDelCarrito(producto.id)}
                                            className="text-xs transition-all"
                                            style={{ color: '#8a8a8a' }}
                                            onMouseEnter={e => e.target.style.color = '#c4728a'}
                                            onMouseLeave={e => e.target.style.color = '#8a8a8a'}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Total */}
                        <div className="flex justify-between items-center mt-6 px-2">
                            <p className="text-sm tracking-widest uppercase" style={{ color: '#8a8a8a' }}>Total</p>
                            <p className="text-2xl font-light" style={{ color: '#8b6bb1' }}>Q{total.toFixed(2)}</p>
                        </div>

                        {/* Botón ingresar orden */}
                        <button
                            onClick={ingresarOrden}
                            disabled={cargando}
                            className="w-full mt-8 py-4 rounded-xl text-sm tracking-widest uppercase font-medium transition-all duration-200"
                            style={{ backgroundColor: cargando ? '#c4b0e0' : '#8b6bb1', color: 'white' }}
                            onMouseEnter={e => e.target.style.backgroundColor = '#a088cc'}
                            onMouseLeave={e => e.target.style.backgroundColor = cargando ? '#c4b0e0' : '#8b6bb1'}
                        >
                            {cargando ? 'Procesando...' : 'Ingresar orden'}
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}