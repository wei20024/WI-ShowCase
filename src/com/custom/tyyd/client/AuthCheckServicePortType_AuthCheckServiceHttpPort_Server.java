
package com.custom.tyyd.client;

import javax.xml.ws.Endpoint;

/**
 * This class was generated by Apache CXF 3.1.1
 * 2015-06-26T11:48:42.475+08:00
 * Generated source version: 3.1.1
 * 
 */
 
public class AuthCheckServicePortType_AuthCheckServiceHttpPort_Server{

    protected AuthCheckServicePortType_AuthCheckServiceHttpPort_Server() throws java.lang.Exception {
        System.out.println("Starting Server");
        Object implementor = new AuthCheckServiceHttpPortImpl();
        String address = "http://10.204.96.225:9080/AuthHub/services/AuthCheckService";
        Endpoint.publish(address, implementor);
    }
    
    public static void main(String args[]) throws java.lang.Exception { 
        new AuthCheckServicePortType_AuthCheckServiceHttpPort_Server();
        System.out.println("Server ready..."); 
        
        Thread.sleep(5 * 60 * 1000); 
        System.out.println("Server exiting");
        System.exit(0);
    }
}
