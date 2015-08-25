package com.huawei.showcase.model.request;

import java.io.Serializable;
import java.util.Map;

import javax.servlet.http.HttpSession;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlTransient;

import com.huawei.showcase.model.SessionInfo;

@XmlRootElement(name="CommonReq")
@XmlAccessorType(XmlAccessType.FIELD)
public class CommonReq
  implements Serializable
{
  private static final long serialVersionUID = -8501347916923280667L;

  @XmlElement(name="transactionId")
  private String transactionId;

  @XmlElement(name="groupId")
  private String groupId;

  @XmlElement(name="tokenId")
  private String tokenId;
  private String userId;

  @XmlTransient
  private String currentIp;

  @XmlTransient
  private HttpSession currentSession;

  @XmlTransient
  private boolean isRetry;

  @XmlTransient
  private Map<String, SessionInfo> currentSessionMap;
  private String requestType;

  public String getTransactionId()
  {
    return this.transactionId;
  }

  public void setTransactionId(String transactionId)
  {
    this.transactionId = transactionId;
  }

  public String getGroupId()
  {
    return this.groupId;
  }

  public void setGroupId(String groupId)
  {
    this.groupId = groupId;
  }

  public String getTokenId()
  {
    return this.tokenId;
  }

  public void setTokenId(String tokenId)
  {
    this.tokenId = tokenId;
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

  public boolean isRetry()
  {
    return this.isRetry;
  }

  public void setRetry(boolean retry)
  {
    this.isRetry = retry;
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
}