package com.custom.tyyd.auth;

import com.huawei.common.custom.meta.request.ExtendFunctionReq;
import com.huawei.common.custom.meta.request.LoginReq;
import com.huawei.common.custom.meta.response.ExtendFunctionRsp;
import com.huawei.common.custom.meta.response.LoginRsp;
import com.huawei.common.custom.util.ContextUtil;
import com.huawei.common.custom.util.EnvInfoUtil;
import com.huawei.common.custom.util.LogManager;
import com.huawei.common.custom.util.PlatFormtUtil;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import javax.servlet.http.HttpServletRequest;

public class TyydCustomUtil {
	private static LogManager log = PlatFormtUtil.getLog();
	private static String basePath = EnvInfoUtil.getCustomDir() + "/conf/";
	
	private static String mobileLogonXmlString = getFileContent(basePath
			+ "mobileLogon.xml");
	private static String checkTokenCodeXmlString = getFileContent(basePath
			+ "checkTokenCode.xml");
	private static String sendTokenCodeXmlString = getFileContent(basePath
			+ "sendTokenCode.xml");


	public static LoginRsp authenticationWith4A(LoginReq req) {
		log.enterMethod();
		LoginRsp rsp = new LoginRsp();
		if ((req.getDymanicCode() == null) || (req.getDymanicCode().isEmpty())) {
			Map params = new HashMap();
			params.put("${uid}", req.getUserName());
			params.put("${sourceIP}", getIp(req));
			params.put("${password}", req.getPassword());
			String xmlString = getXmlString(mobileLogonXmlString, params);

			log.info(xmlString);

			String result = "";
			try {
				result = AuthClient.mobileLogon(xmlString);
			} catch (Exception e) {
				log.error(e);
				rsp.setResultCode(411000);
				return rsp;
			}
			log.info(result);
			int code = getResultCode(result);
			if (code == 1) {
				rsp.setResultCode(410224);
			} else if (code == 2) {
				rsp.setResultCode(0);
			} else {
				rsp.setResultCode(code);
				log.error("mobileLogon 4A error. result=" + result);
			}
			return rsp;
		}

		Map params = new HashMap();
		params.put("${uid}", req.getUserName());
		params.put("${tokenCode}", req.getDymanicCode());
		params.put("${businessID}", "01");
		params.put("${sourceIP}", getIp(req));

		String xmlString = getXmlString(checkTokenCodeXmlString, params);
		log.info("xmlString:" + xmlString);

		String result = "";
		try {
			result = AuthClient.checkTokenCode(xmlString);
		} catch (Exception e) {
			log.error(e);
			rsp.setResultCode(411000);
			return rsp;
		}

		log.info(result);
		int code = getResultCode(result);
		if (code == 1) {
			rsp.setResultCode(0);
		} else {
			rsp.setResultCode(code);
			log.error("mobileLogon 4A error. result=" + result);
		}
		return rsp;
	}

	public static ExtendFunctionRsp resetPwd(ExtendFunctionReq req) {
		ExtendFunctionRsp rsp = new ExtendFunctionRsp();
		List<String> extendDatas = req.getExtendList();
		String type = "";
		String ip = null;
		String userName = "";
		String dymanicCode = null;
		for (String data : extendDatas) {
			int start = data.indexOf("{changeType}:");
			if (start != -1) {
				type = data.substring(start + 13);
			}

			start = data.indexOf("{userName}:");
			if (start != -1) {
				userName = data.substring(start + 11);
			}

			start = data.indexOf("{clientIp}:");
			if (start != -1) {
				ip = data.substring(start + 11);
			}

			start = data.indexOf("{dymanicCode}:");
			if (start != -1) {
				dymanicCode = data.substring(start + 14);
			}
		}

		if (type.equals("1")) {
			Map params = new HashMap();
			params.put("${uid}", userName);
			params.put("${sourceIP}", getClientIp(ip));

			String xmlString = getXmlString(sendTokenCodeXmlString, params);
			log.info("xmlString:" + xmlString);

			String result = "";
			try {
				result = AuthClient.sendTokenCode(xmlString);
			} catch (Exception e) {
				log.error(e);
				rsp.setResultCode(411000);
				return rsp;
			}

			log.info(result);
			int code = getResultCode(result);
			if (code == 1) {
				rsp.setResultCode(0);
			} else {
				rsp.setResultCode(code);
				log.error("mobileLogon 4A error. result=" + result);
			}
			return rsp;
		}

		if ((dymanicCode == null) || (dymanicCode.isEmpty())) {
			log.error("dymanicCode is null. req = " + req.getExtendList());
			rsp.setResultCode(410200);
			return rsp;
		}
		Map params = new HashMap();
		params.put("${uid}", userName);
		params.put("${tokenCode}", dymanicCode);
		params.put("${businessID}", "02");
		params.put("${sourceIP}", getClientIp(ip));

		String xmlString = getXmlString(checkTokenCodeXmlString, params);
		log.info("xmlString:" + xmlString);

		String result = "";
		try {
			result = AuthClient.checkTokenCode(xmlString);
		} catch (Exception e) {
			log.error(e);
			rsp.setResultCode(411000);
			return rsp;
		}

		log.info(result);
		int code = getResultCode(result);
		if (code == 1) {
			rsp.setResultCode(0);
		} else {
			rsp.setResultCode(code);
			log.error("mobileLogon 4A error. result=" + result);
		}
		return rsp;
	}

	private static String getClientIp(String ip) {
		if ((ip != null) && (!ip.equals(""))) {
			return ip;
		}
		return getRemoteIp();
	}

	private static String getFileContent(String path) {
		FileReader fr = null;
		BufferedReader br = null;
		try {
			fr = new FileReader(path);
			br = new BufferedReader(fr);
			StringBuffer sb = new StringBuffer();
			String con = null;
			while ((con = br.readLine()) != null) {
				sb.append(con);
			}
			return sb.toString();
		} catch (Exception e) {
			log.error(e);
		} finally {
			if (fr != null) {
				try {
					fr.close();
				} catch (IOException e) {
					log.error(e);
				}
			}
			if (br != null) {
				try {
					br.close();
				} catch (IOException e) {
					log.error(e);
				}
			}
		}

		return null;
	}

	private static String getIp(LoginReq req) {
		if (req.getExtendData() != null) {
			return req.getExtendData();
		}
		return getRemoteIp();
	}

	private static String getRemoteIp() {
		HttpServletRequest request = ContextUtil.getRequest();
		String ip = request.getHeader("x-forwarded-for");
		if ((ip == null) || (ip.length() == 0)
				|| ("unknown".equalsIgnoreCase(ip))) {
			ip = request.getHeader("Proxy-Client-IP");
		}
		if ((ip == null) || (ip.length() == 0)
				|| ("unknown".equalsIgnoreCase(ip))) {
			ip = request.getHeader("WL-Proxy-Client-IP");
		}
		if ((ip == null) || (ip.length() == 0)
				|| ("unknown".equalsIgnoreCase(ip))) {
			ip = request.getRemoteAddr();
		}
		return ip.equals("0:0:0:0:0:0:0:1") ? "127.0.0.1" : ip;
	}

	private static String getXmlString(String original,
			Map<String, String> params) {
		String str = new String(original);
		for (Map.Entry param : params.entrySet()) {
			str = str.replace((CharSequence) param.getKey(),
					(CharSequence) param.getValue());
		}
		return str;
	}

	private static int getResultCode(String xmlString) {
		if (xmlString == null) {
			return -1;
		}
		try {
			int start = xmlString.indexOf("<retCode>");
			int end = xmlString.indexOf("</retCode>");
			if ((start != -1) && (end != -1)) {
				return Integer.parseInt(xmlString.substring(start + 9, end));
			}
		} catch (Exception e) {
			log.error(e);
		}
		return -1;
	}
}