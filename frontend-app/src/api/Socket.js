import io from 'socket.io-client';
import { getBaseURL } from '../config/Utils';

const Socket = io.connect(getBaseURL());

export default Socket;