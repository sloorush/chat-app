const socket=io()

//elements
const $messageForm=document.querySelector('#message-form')
const $messageFormInput=document.querySelector('input')
const $messageFormButton=document.querySelector('button')
const $sendLocationButton=document.querySelector('#send-location')
const $messages=document.querySelector('#messages')

//templates
const messageTemplate=document.querySelector('#message-template').innerHTML
const locationTemplate=document.querySelector('#location-message-template').innerHTML

//options
const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})

socket.on('message',(message)=>{
	console.log(message)
	const html=Mustache.render(messageTemplate,{
		message:message.text,
		createdAt:moment(message.createdAt).format('h:mm a')
	})
	$messages.insertAdjacentHTML('beforeend',html)
})

socket.on('locationMessage',(message)=>{
	console.log(message)
	const html=Mustache.render(locationTemplate,{
		url:message.url,
		createdAt: moment(message.createdAt).format('h:mm a')
	})
	$messages.insertAdjacentHTML('beforeend',html)
})

$messageForm.addEventListener('submit',(e)=>{
	e.preventDefault()
	// disable form
	$messageFormButton.setAttribute('disabled','disabled')
	const message=e.target.elements.message.value

	socket.emit('sendMessage',message,(error)=>{
		// enable form
		$messageFormButton.removeAttribute('disabled')
		//clear input after message sent
		$messageFormInput.value=''
		//return focus on textbox after msg send
		$messageFormInput.focus()

		if(error){
			return console.log(error)
		}
		console.log(message)
	})
})

$sendLocationButton.addEventListener('click',()=>{
	if(!navigator.geolocation){
		return alert('geolocation is not suppoerted, pls update browser')
	}

	//disable location btn
	$sendLocationButton.setAttribute('disabled','disabled')

	navigator.geolocation.getCurrentPosition((position)=>{
		socket.emit('sendLocation',{
			latitude:position.coords.latitude,
			longitude:position.coords.longitude
		},()=>{

			//enable location btn
			$sendLocationButton.removeAttribute('disabled')

			console.log('Location shared!')
		})
	})
})

socket.emit('join',{username, room})