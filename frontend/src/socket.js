import {io} from 'socket.io-client'

let socket;

const IO = {
  init(httpServer){
    console.log('initializing socker')
    socket = io(httpServer);
    return socket;
  },
  getIO(){
    
    if (!socket) {
      console.log('creating new socket')
      // this means the friend has given the link
      socket = io(process.env.REACT_APP_BACKEND_URL)
    }
    return socket;
  }
};
 
export default IO