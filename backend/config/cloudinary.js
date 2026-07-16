import cloudinary from 'cloudinary'

const connectCloudinary = () => {
    try {
        const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env
        if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
            console.warn('Cloudinary env vars missing; skipping cloudinary configuration.')
            return
        }

        cloudinary.v2.config({
            cloud_name: CLOUDINARY_CLOUD_NAME,
            api_key: CLOUDINARY_API_KEY,
            api_secret: CLOUDINARY_API_SECRET,
        })

        console.log('Cloudinary configured')
    } catch (error) {
        console.error('Cloudinary configuration failed:', error.message)
    }
}

export default connectCloudinary
