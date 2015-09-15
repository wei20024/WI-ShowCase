package com.huawei.showcase.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

import com.huawei.showcase.common.util.configration.Configuration;

@Controller
@RequestMapping({"/pages"})
public class WebController
{

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
    int loginType =loginPropConf.getInt("logintype", 0);
    map.addAttribute("loginType", Integer.valueOf(loginType));
    map.addAttribute("twoAuthType", "0");
    return  "/default/pages/explicit.ftl";
  }

  @RequestMapping({"/homepage"})
  public String getvmlist(ModelMap map)
  {
    String redirectUrl = "/default/pages/homepage.ftl";
   
    return BASE_FTL + redirectUrl;
  }

  @RequestMapping({"/logout"})
  public String printLogin(ModelMap map)
  {
    return BASE_FTL + "/default/pages/logout.ftl";
  }

  @RequestMapping({"/changepassword"})
  public String changepassword(ModelMap map)
  {

    return BASE_FTL + "/default/pages/changepassword.ftl";
  }
}