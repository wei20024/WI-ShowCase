package com.custom.tyyd.client;

import javax.jws.WebMethod;
import javax.jws.WebParam;
import javax.jws.WebResult;
import javax.jws.WebService;
import javax.xml.bind.annotation.XmlSeeAlso;
import javax.xml.ws.RequestWrapper;
import javax.xml.ws.ResponseWrapper;

/**
 * This class was generated by Apache CXF 3.1.1
 * 2015-06-26T11:48:42.458+08:00
 * Generated source version: 3.1.1
 * 
 */
@WebService(targetNamespace = "http://services.com", name = "AuthCheckServicePortType")
@XmlSeeAlso({ObjectFactory.class})
public interface AuthCheckServicePortType {

    @WebResult(name = "out", targetNamespace = "http://services.com")
    @RequestWrapper(localName = "checkTokenCode", targetNamespace = "http://services.com", className = "com.custom.tyyd.client.CheckTokenCode")
    @WebMethod
    @ResponseWrapper(localName = "checkTokenCodeResponse", targetNamespace = "http://services.com", className = "com.custom.tyyd.client.CheckTokenCodeResponse")
    public java.lang.String checkTokenCode(
        @WebParam(name = "in0", targetNamespace = "http://services.com")
        java.lang.String in0
    );

    @WebResult(name = "out", targetNamespace = "http://services.com")
    @RequestWrapper(localName = "checkAnswer", targetNamespace = "http://services.com", className = "com.custom.tyyd.client.CheckAnswer")
    @WebMethod
    @ResponseWrapper(localName = "checkAnswerResponse", targetNamespace = "http://services.com", className = "com.custom.tyyd.client.CheckAnswerResponse")
    public java.lang.String checkAnswer(
        @WebParam(name = "in0", targetNamespace = "http://services.com")
        java.lang.String in0
    );

    @WebResult(name = "out", targetNamespace = "http://services.com")
    @RequestWrapper(localName = "sendTokenCode", targetNamespace = "http://services.com", className = "com.custom.tyyd.client.SendTokenCode")
    @WebMethod
    @ResponseWrapper(localName = "sendTokenCodeResponse", targetNamespace = "http://services.com", className = "com.custom.tyyd.client.SendTokenCodeResponse")
    public java.lang.String sendTokenCode(
        @WebParam(name = "in0", targetNamespace = "http://services.com")
        java.lang.String in0
    );

    @WebResult(name = "out", targetNamespace = "http://services.com")
    @RequestWrapper(localName = "getAsk", targetNamespace = "http://services.com", className = "com.custom.tyyd.client.GetAsk")
    @WebMethod
    @ResponseWrapper(localName = "getAskResponse", targetNamespace = "http://services.com", className = "com.custom.tyyd.client.GetAskResponse")
    public java.lang.String getAsk(
        @WebParam(name = "in0", targetNamespace = "http://services.com")
        java.lang.String in0
    );

    @WebResult(name = "out", targetNamespace = "http://services.com")
    @RequestWrapper(localName = "mobileLogon", targetNamespace = "http://services.com", className = "com.custom.tyyd.client.MobileLogon")
    @WebMethod
    @ResponseWrapper(localName = "mobileLogonResponse", targetNamespace = "http://services.com", className = "com.custom.tyyd.client.MobileLogonResponse")
    public java.lang.String mobileLogon(
        @WebParam(name = "in0", targetNamespace = "http://services.com")
        java.lang.String in0
    );
}