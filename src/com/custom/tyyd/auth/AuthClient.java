package com.custom.tyyd.auth;

import java.net.URL;

import javax.xml.namespace.QName;

import com.custom.tyyd.client.AuthCheckService;
import com.custom.tyyd.client.AuthCheckServicePortType;
import com.custom.tyyd.client.AuthCheckServicePortType_AuthCheckServiceHttpPort_Client;
import com.huawei.common.custom.util.LogManager;
import com.huawei.common.custom.util.PlatFormtUtil;

public class AuthClient {
	private static final QName SERVICE_NAME = new QName("http://services.com",
			"AuthCheckService");

	private static LogManager log = PlatFormtUtil.getLog();
	private static AuthCheckService authService;
	private static AuthCheckServicePortType port;

	static {
		try {
			String wsdlPath = getWsdlPath();
			log.info("wsdlPath = " + wsdlPath);
			URL url = new URL(wsdlPath);
			authService = new AuthCheckService(url,SERVICE_NAME);
			port = authService.getAuthCheckServiceHttpPort();
		} catch (Exception e) {
			log.error(e);
			try {
				authService = new AuthCheckService(
						new URL(
								"http://10.204.96.225:9080/AuthHub/services/AuthCheckService?wsdl"));
				port = authService.getAuthCheckServiceHttpPort();
			} catch (Exception a) {
				log.error(a);
			}
		}
	}

	public static void main(String[] args) {

		mobileLogon("fdsafdsfadsf");
	}

	public static String mobileLogon(String xmlString) {
		String result = AuthCheckServicePortType_AuthCheckServiceHttpPort_Client.login(getWsdlPath(), xmlString);
//		 result = port.mobileLogon(xmlString);
		return result;
	}

	public static String checkTokenCode(String xmlString) {
		String result = port.checkTokenCode(xmlString);
		AuthCheckServicePortType_AuthCheckServiceHttpPort_Client.test();
		return result;
	}

	public static String sendTokenCode(String xmlString) {
		String result = port.sendTokenCode(xmlString);
		return result;
	}

	private static String getWsdlPath() {
		return "http://10.204.96.225:9080/AuthHub/services/AuthCheckService?wsdl";
	}
}