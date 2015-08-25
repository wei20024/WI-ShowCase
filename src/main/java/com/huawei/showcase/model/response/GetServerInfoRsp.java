package com.huawei.showcase.model.response;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name="GetServerInfoRsp")
@XmlAccessorType(XmlAccessType.FIELD)
public class GetServerInfoRsp
{
  private String versionName;
  private Integer versionCode;
  private String clientDownloadPath;
  private int logintype;
  private String androidClientVersion;
  private String iosClientVersion;
  private String smsOTPAuth;
  private String anonymousFlag;
  private String noticeZH;
  private String noticeEN;

  public String getVersionName()
  {
    return this.versionName;
  }

  public void setVersionName(String versionName)
  {
    this.versionName = versionName;
  }

  public Integer getVersionCode()
  {
    return this.versionCode;
  }

  public void setVersionCode(Integer versionCode)
  {
    this.versionCode = versionCode;
  }

  public String getClientDownloadPath()
  {
    return this.clientDownloadPath;
  }

  public void setClientDownloadPath(String clientDownloadPath)
  {
    this.clientDownloadPath = clientDownloadPath;
  }

  public int getLogintype()
  {
    return this.logintype;
  }

  public void setLogintype(int logintype)
  {
    this.logintype = logintype;
  }

  public String getAndroidClientVersion()
  {
    return this.androidClientVersion;
  }

  public void setAndroidClientVersion(String androidClientVersion)
  {
    this.androidClientVersion = androidClientVersion;
  }

  public String getIosClientVersion()
  {
    return this.iosClientVersion;
  }

  public void setIosClientVersion(String iosClientVersion)
  {
    this.iosClientVersion = iosClientVersion;
  }

  public String getSmsOTPAuth()
  {
    return this.smsOTPAuth;
  }

  public void setSmsOTPAuth(String smsOTPAuth)
  {
    this.smsOTPAuth = smsOTPAuth;
  }

  public String getAnonymousFlag()
  {
    return this.anonymousFlag;
  }

  public void setAnonymousFlag(String anonymousFlag)
  {
    this.anonymousFlag = anonymousFlag;
  }

  public String getNoticeZH()
  {
    return this.noticeZH;
  }

  public void setNoticeZH(String noticeZH)
  {
    this.noticeZH = noticeZH;
  }

  public String getNoticeEN()
  {
    return this.noticeEN;
  }

  public void setNoticeEN(String noticeEN)
  {
    this.noticeEN = noticeEN;
  }
}