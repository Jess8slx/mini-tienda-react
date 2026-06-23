import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore'
import { db } from '../firebase'

export default function Login() {
    const [correo, setCorreo] = useState('')
    const [cargando, setCargando] = useState(false)
    const navigate = useNavigate()

    // Al cargar, si ya hay sesión guardada, ira directo al catálogo
    if (localStorage.getItem('usuarioId')) {
        navigate('/catalogo')
    }

    async function handleLogin() {
        if (!correo) return

        setCargando(true)

        // Buscar si el correo ya existe en la colección "usuarios"
        const usuariosRef = collection(db, 'usuarios')
        const q = query(usuariosRef, where('correo', '==', correo))
        const resultado = await getDocs(q)

        if (!resultado.empty) {
            // El usuario ya existe — guardar su id y redirigir
            const usuarioDoc = resultado.docs[0]
            localStorage.setItem('usuarioId', usuarioDoc.id)
        } else {
            // El usuario no existe — crearlo y guardar su id
            const nuevoDoc = await addDoc(usuariosRef, { correo: correo })
            localStorage.setItem('usuarioId', nuevoDoc.id)
        }

        setCargando(false)
        navigate('/catalogo')
    }

    return (
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#faf8fd' }}>
            <div className="bg-white rounded-3xl shadow-sm border p-10 w-full max-w-sm" style={{ borderColor: '#ede8f5' }}>

                {/* Logo / título */}
                <div className="text-center mb-8">
                    <p className="text-4xl mb-3">🌸</p>
                    <h1 className="text-2xl font-light tracking-widest" style={{ color: '#2d2d2d' }}>
                        BLOOM
                    </h1>
                    <p className="text-sm mt-1" style={{ color: '#8a8a8a' }}>
                        Arreglos Florales
                    </p>
                </div>

                {/* Campo de correo */}
                <div className="mb-6">
                    <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: '#8a8a8a' }}>
                        Correo electrónico
                    </label>
                    <input
                        type="email"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        placeholder="tu@correo.com"
                        className="w-full px-4 py-3 rounded-xl outline-none text-sm"
                        style={{
                            backgroundColor: '#faf8fd',
                            border: '1px solid #ede8f5',
                            color: '#2d2d2d'
                        }}
                    />
                </div>

                {/* Botón */}
                <button
                    onClick={handleLogin}
                    disabled={cargando}
                    className="w-full py-3 rounded-xl text-sm tracking-widest uppercase font-medium transition-all"
                    style={{
                        backgroundColor: cargando ? '#c4b0e0' : '#8b6bb1',
                        color: 'white'
                    }}
                >
                    {cargando ? 'Ingresando...' : 'Ingresar'}
                </button>

            </div>
        </div>
    )
}