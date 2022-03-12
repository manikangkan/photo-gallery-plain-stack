const { Router } = require('express')
const router = Router()

const Photo = require('../models/Photo')
const cloudinary = require('cloudinary')

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
})

const fs = require('fs-extra')

router.get('/', async (req, res) => {
	const result = await Photo.find()
	let collection = []
	result.forEach((data) => {
		collection.push({
			title: data.title,
			description: data.description,
			imageURL: data.imageURL,
		})
	})

	res.render('images', { photos: collection })
})

router.get('/images/add', async (req, res) => {
	const result = await Photo.find()
	let collection = []
	result.forEach((data) => {
		collection.push({
			_id: data._id,
			title: data.title,
			description: data.description,
			imageURL: data.imageURL,
			public_id: data.public_id,
		})
	})

	res.render('image_form', { photos: collection })
})
router.post('/images/add', async (req, res) => {
	const { title, description } = req.body

	const result = await cloudinary.v2.uploader.upload(req.file.path)

	const newPhoto = new Photo({
		title,
		description,
		imageURL: result.secure_url,
		public_id: result.public_id,
	})

	await newPhoto.save()
	await fs.unlink(req.file.path)

	res.redirect('/')
})
router.get('/images/delete/:photo_id', async (req, res) => {
	const { photo_id } = req.params
	const photo = await Photo.findByIdAndDelete(photo_id)
	const result = await cloudinary.v2.uploader.destroy(photo.public_id)

	console.log(result)
	res.redirect('/images/add')
})

module.exports = router
