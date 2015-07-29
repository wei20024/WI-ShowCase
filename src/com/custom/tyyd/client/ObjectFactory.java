
package com.custom.tyyd.client;

import javax.xml.bind.annotation.XmlRegistry;


/**
 * This object contains factory methods for each 
 * Java content interface and Java element interface 
 * generated in the com.custom.tyyd.client package. 
 * <p>An ObjectFactory allows you to programatically 
 * construct new instances of the Java representation 
 * for XML content. The Java representation of XML 
 * content can consist of schema derived interfaces 
 * and classes representing the binding of schema 
 * type definitions, element declarations and model 
 * groups.  Factory methods for each of these are 
 * provided in this class.
 * 
 */
@XmlRegistry
public class ObjectFactory {


    /**
     * Create a new ObjectFactory that can be used to create new instances of schema derived classes for package: com.custom.tyyd.client
     * 
     */
    public ObjectFactory() {
    }

    /**
     * Create an instance of {@link CheckTokenCode }
     * 
     */
    public CheckTokenCode createCheckTokenCode() {
        return new CheckTokenCode();
    }

    /**
     * Create an instance of {@link CheckTokenCodeResponse }
     * 
     */
    public CheckTokenCodeResponse createCheckTokenCodeResponse() {
        return new CheckTokenCodeResponse();
    }

    /**
     * Create an instance of {@link SendTokenCode }
     * 
     */
    public SendTokenCode createSendTokenCode() {
        return new SendTokenCode();
    }

    /**
     * Create an instance of {@link SendTokenCodeResponse }
     * 
     */
    public SendTokenCodeResponse createSendTokenCodeResponse() {
        return new SendTokenCodeResponse();
    }

    /**
     * Create an instance of {@link MobileLogon }
     * 
     */
    public MobileLogon createMobileLogon() {
        return new MobileLogon();
    }

    /**
     * Create an instance of {@link MobileLogonResponse }
     * 
     */
    public MobileLogonResponse createMobileLogonResponse() {
        return new MobileLogonResponse();
    }

    /**
     * Create an instance of {@link GetAsk }
     * 
     */
    public GetAsk createGetAsk() {
        return new GetAsk();
    }

    /**
     * Create an instance of {@link GetAskResponse }
     * 
     */
    public GetAskResponse createGetAskResponse() {
        return new GetAskResponse();
    }

    /**
     * Create an instance of {@link CheckAnswer }
     * 
     */
    public CheckAnswer createCheckAnswer() {
        return new CheckAnswer();
    }

    /**
     * Create an instance of {@link CheckAnswerResponse }
     * 
     */
    public CheckAnswerResponse createCheckAnswerResponse() {
        return new CheckAnswerResponse();
    }

}
