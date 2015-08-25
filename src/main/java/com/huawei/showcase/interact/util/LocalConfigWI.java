package com.huawei.showcase.interact.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

//import com.huawei.showcase.common.util.configration.WriteConf;
//import com.huawei.showcase.model.ItaInfo;
import com.huawei.showcase.common.util.configration.Configuration;
import com.huawei.showcase.model.UserGroupInfo;
import com.huawei.showcase.model.WiInfo;

public class LocalConfigWI {
	static Map<String,WiInfo> Winfomap =null;
	static Configuration loginPropConf = Configuration.getControllerPropInstance();
	private static final String propWI_IP = "wi.ip";

	static{
		getWiInfoMap();
	}
	/**
	 * 从本地 获取 WI信息 
	 * @param userInfo
	 * @return
	 */
	public static String getRandomWiId(){
		for(String wiId:Winfomap.keySet())		
			return wiId;
		return null;
	}
	public static List<String>getWiIds()
	{
		List<String> wiList = new ArrayList<String>();
		for(String wiId:Winfomap.keySet())	
			wiList.add(wiId);
		return wiList;
	}
	public static List<String>getWiInfoByUser(UserGroupInfo userInfo)
	{
		List<String> wiList = new ArrayList<String>();
		wiList.add("wi1");
		return wiList;
	}
	public static Map<String,WiInfo>getWiInfoMap()
	{
		//if(Winfomap==null) {
			Winfomap= new HashMap<String, WiInfo>();
			String wiprop = loginPropConf.getString(propWI_IP);
			String[] wis = wiprop.split("/");
			int index = 0;
			String wiId="";
			String wiIP = "";			
			for(String wi:wis){
				index = wi.indexOf(',');
				//格式出错，崩溃
				wiId = wi.substring(0,index);
				wiIP = wi.substring(index+1);
				if(!isIPValid(wiIP))continue;				
				
				WiInfo wiInfo = new WiInfo();	
				wiInfo.setWiName(wiId);				
				wiInfo.setComponentIp(wiIP);
				wiInfo.setComponentPort("443");
				
				Winfomap.put(wiId, wiInfo);
			}
		//}

		return Winfomap;
	}
	private static boolean isIPValid(String testIP){
		if(testIP.matches("[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}"))return true;
		return false;
	}

	public static List<String> getGloableWiInfos() {
		
		return null;
	}
	public static List<WiInfo> getWiInfos() {	
		getWiInfoMap();
		List<WiInfo> list = new ArrayList<WiInfo>();
		for(String key:Winfomap.keySet()){
			list.add(Winfomap.get(key));
		}
		return list ;
	}
}
