package com.huawei.showcase.web.controller;

import java.util.HashMap;
import java.util.Iterator;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

import com.huawei.showcase.common.util.configration.Configuration;

@Controller
@RequestMapping({"/pages"})
public class WebController
{

  private static final String CUSTOM_IMG_PATH = "/uns/default/img/";
  private static final String BASE_FTL = "";

  
  @RequestMapping({"/init"})
  public String init(ModelMap map)
  {
    return "/common/pages/init.ftl";
  }

  @RequestMapping({"/login"})
  public String login(ModelMap map)
  {
	Configuration loginPropConf = Configuration.getControllerPropInstance();
    int loginType =loginPropConf.getInt("logintype", 0);// WriteConf.getInstance().getLoginType();

    String twoAuthType = loginPropConf.getString("dynamicPassword.2FactorAuth");

    map.addAttribute("loginType", Integer.valueOf(loginType));

    map.addAttribute("twoAuthType", twoAuthType);

    setConfig(map);

    return  "/default/pages/explicit.ftl";
  }

  @RequestMapping({"/homepage"})
  public String getvmlist(ModelMap map)
  {
    setConfig(map);

     String redirectUrl = "/default/pages/homepage.ftl";
   
    return BASE_FTL + redirectUrl;
  }

  @RequestMapping({"/logout"})
  public String printLogin(ModelMap map)
  {
    setConfig(map);

    return BASE_FTL + "/default/pages/logout.ftl";
  }

  @RequestMapping({"/changepassword"})
  public String changepassword(ModelMap map)
  {
    setConfig(map);

    return BASE_FTL + "/default/pages/changepassword.ftl";
  }

  private void setConfig(ModelMap map)
  {

    Configuration loginPropConf = Configuration.getControllerPropInstance();
    String customString = loginPropConf.getString("custom.img.replace");
    HashMap<String, String> hash = getCustomImgConfig(customString);

    for (Iterator<String> ite = hash.keySet().iterator(); ite.hasNext(); )
    {
      String key = (String)ite.next();

      map.addAttribute((String)hash.get(key), CUSTOM_IMG_PATH + key);
    }

    
  }

  private HashMap<String, String> getCustomImgConfig(String configString)
  {
    if ((configString == null) || (configString.isEmpty()))
    {
      return null;
    }

    HashMap<String, String> hash = new HashMap<String, String>();

    String[] values = configString.split("#");

    for (String value : values)
    {
      String[] subValues = value.split(":");
      hash.put(subValues[0], subValues[1]);
    }

    return hash;
  }
}