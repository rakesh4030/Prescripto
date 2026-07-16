


// API for adding doctor
import doctorModel from '../models/doctorModel.js'

// API for adding doctor via multipart/form-data (with optional image file)
const addDoctor = async (req, res) => {
    try {
        let { name, email, password, speciality, degree, experience, about, fees, address } = req.body
        if (typeof address === 'string') {
            try { address = JSON.parse(address) } catch (e) { address = { line1: address } }
        }
        const imageFile = req.file
        const imageUrl = imageFile ? `/uploads/${imageFile.filename}` : ''

        const doctor = await doctorModel.create({
            name,
            email,
            password,
            image: imageUrl,
            speciality,
            degree,
            experience,
            about,
            fees,
            address,
            date: Date.now()
        })

        res.json({ success: true, doctor })
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: 'Failed to add doctor' })
    }
}

// Dev helper: create a doctor from JSON body quickly
const seedDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body
        const doctor = await doctorModel.create({
            name: name || 'Seed Doctor',
            email: email || `seed-${Date.now()}@example.com`,
            password: password || 'password',
            image: '/uploads/default.png',
            speciality: speciality || 'General',
            degree: degree || 'MD',
            experience: experience || '1 year',
            about: about || 'Seeded doctor',
            fees: fees || 100,
            address: address || { line1: 'Seed Clinic', line2: '' },
            date: Date.now()
        })
        res.json({ success: true, doctor })
    } catch (error) {
        console.error('Seed error:', error)
        res.status(500).json({ success: false, message: 'Seeding failed', error: error?.message })
    }
}

export { addDoctor, seedDoctor }