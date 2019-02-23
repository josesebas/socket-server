import express from 'express';
import {SERVER_PORT } from '../global/enviroment';
import socketIO from 'socket.io';
import http from 'http';

import * as func_sockets from '../sockets/socket';

export default class Server{
	public app:express.Application;
	public port:number;
	public io:socketIO.Server;

	private httpServer:http.Server;
	private static _instance:Server;
	constructor(){
		this.app=express();
		this.port=SERVER_PORT;

		this.httpServer=new http.Server(this.app);
		this.io=socketIO(this.httpServer);
	
		this.escucharSockets();
	}
	public static get instance(){
		return this._instance||(this._instance=new this());
	}
	private escucharSockets(){
		console.log('escuchando conexiones - sockets');
		this.io.on('connection',cliente=>{
			console.log('Nuevo cliente');

			//otra funcion
			func_sockets.mensaje(cliente, this.io);
			
			//funciones de socket de la carpeta donde los manejaremos
			func_sockets.desconectar(cliente);

		});
		
	}

	start(callback:Function){
		this.httpServer.listen(this.port, callback);
	}


}