package com.huawei.showcase.model.request;

import com.huawei.showcase.model.SessionInfo;

import java.util.Map;
import javax.servlet.http.HttpSession;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlTransient;

@XmlRootElement(name="UnsCommonReq")
@XmlAccessorType(XmlAccessType.FIELD)
public class UnsCommonReq extends CommonReq
{
  private static final long serialVersionUID = -8501347916923280667L;

  @XmlElement(name="transactionId")
  private String transactionId;

  @XmlElement(name="groupId")
  private String groupId; //用于标识WI,WiId
  
  private String userId;

  @XmlTransient
  private String currentIp;

  @XmlTransient
  private HttpSession currentSession;

  @XmlTransient
  private boolean retry;

  @XmlTransient
  private Map<String, SessionInfo> currentSessionMap;
  private String requestType;
  private boolean login;

  public String getTransactionId()
  {
    return this.transactionId;
  }

  public void setTransactionId(String transactionId)
  {
    this.transactionId = transactionId;
  }

  /*
   * 用于标识WI 
   * */
  public String getGroupId()
  {
    return this.groupId;
  }
  /*
   * 用于标识WI 
   * */
  public void setGroupId(String groupId)
  {
    this.groupId = groupId;
  }

  public Map<String, SessionInfo> getCurrentSessionMap()
  {
    return this.currentSessionMap;
  }

  public void setCurrentSessionMap(Map<String, SessionInfo> currentSessionMap)
  {
    this.currentSessionMap = currentSessionMap;
  }

  public String getUserId()
  {
    return this.userId;
  }

  public void setUserId(String userId)
  {
    this.userId = userId;
  }

  public boolean getRetry()
  {
    return this.retry;
  }

  public void setRetry(boolean retry)
  {
    this.retry = retry;
  }

  public HttpSession getCurrentSession()
  {
    return this.currentSession;
  }

  public void setCurrentSession(HttpSession currentSession)
  {
    this.currentSession = currentSession;
  }

  public String getCurrentIp()
  {
    return this.currentIp;
  }

  public void setCurrentIp(String currentIp)
  {
    this.currentIp = currentIp;
  }

  public String getRequestType()
  {
    return this.requestType;
  }

  public void setRequestType(String requestType)
  {
    this.requestType = requestType;
  }

  public boolean isLogin()
  {
    return this.login;
  }

  public void setLogin(boolean login)
  {
    this.login = login;
  }
}