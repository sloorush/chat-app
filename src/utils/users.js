const users=[]

const addUser=({id, username, room})=>{
	//clean data
	username=username.trim().toLowerCase()
	room=room.trim().toLowerCase()

	//validate
	if(!username || !room){
		return {
			error:'Username and room are required!'
		}
	}

	//check for existing user
	const exitingUser=users.find((user)=>{
		return user.room===room &&user.username===username
	})

	//validate username
	if(exisitingUser){
		return{
			error:'Username is already in use!'
		}
	}

	//store user
	const user={id,username,room}
	users.push(user)
	return {user}
}

