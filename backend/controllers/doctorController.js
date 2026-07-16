import doctorModel from '../models/doctorModel.js'

// API for adding doctor
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

const getDoctors = async (req, res) => {
    try {
        const doctors = await doctorModel.find({})
        res.json({ success: true, doctors })
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: 'Failed to fetch doctors' })
    }
}

export { addDoctor, getDoctors }