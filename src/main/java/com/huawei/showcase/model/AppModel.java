package com.huawei.showcase.model;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name="AppModel")
@XmlAccessorType(XmlAccessType.FIELD)
public class AppModel implements java.io.Serializable
{
  

  /**
	 * 
	 */
	private static final long serialVersionUID = 5145568994515418490L;

@XmlElement(name="appId")
  private String appId;

  @XmlElement(name="farmId")
  private String farmId;

  @XmlElement(name="userSid")
  private String userSid;

  @XmlElement(name="name")
  private String name;

  @XmlElement(name="exePath")
  private String exePath;

  @XmlElement(name="version")
  private String version;

  @XmlElement(name="publisher")
  private String publisher;

  @XmlElement(name="param")
  private String param;

  @XmlElement(name="workPath")
  private String workPath;

  @XmlElement(name="descriptor")
  private String descriptor;

  @XmlElement(name="owner")
  private String owner;

  @XmlElement(name="state")
  private String state;

  @XmlElement(name="appGroupName")
  private String appGroupName;

  @XmlElement(name="appGroupId")
  private String appGroupId;

  @XmlElement(name="favoriteFlag")
  private Integer favoriteFlag = Integer.valueOf(0);

  @XmlElement(name="appType")
  private Integer appType;

  @XmlElement(name="groupId")
  private String groupId;

  @XmlElement(name="appName")
  private String appName;

  public String toString()
  {
    StringBuilder builder = new StringBuilder();
    builder.append("appId=" + this.appId);
    builder.append("farmId=" + this.farmId);
    builder.append(",name=" + this.name);
    builder.append(",version=" + this.version);
    builder.append(",state=" + this.state);
    builder.append(",appGroupName=" + this.appGroupName);
    builder.append(",appGroupId=" + this.appGroupId);
    builder.append(",favoriteFlag=" + this.favoriteFlag);
    builder.append(",appType=" + this.appType);
    builder.append(",groupId=" + this.groupId);
    builder.append(",appName=" + this.appName);
    return builder.toString();
  }

  @Override
  public boolean equals(Object other)
  {
	  AppModel otherApp = (AppModel)other;
	  if(this.appId.equals(otherApp.appId))return true;
	  return false;
  }
  public String getAppId()
  {
    return this.appId;
  }

  public void setAppId(String appId)
  {
    this.appId = appId;
  }

  public String getName()
  {
    return this.name;
  }

  public void setName(String name)
  {
    this.name = name;
  }

  public String getExePath()
  {
    return this.exePath;
  }

  public void setExePath(String exePath)
  {
    this.exePath = exePath;
  }

  public String getVersion()
  {
    return this.version;
  }

  public void setVersion(String version)
  {
    this.version = version;
  }

  public String getPublisher()
  {
    return this.publisher;
  }

  public void setPublisher(String publisher)
  {
    this.publisher = publisher;
  }

  public String getParam()
  {
    return this.param;
  }

  public void setParam(String param)
  {
    this.param = param;
  }

  public String getWorkPath()
  {
    return this.workPath;
  }

  public void setWorkPath(String workPath)
  {
    this.workPath = workPath;
  }

  public String getDescriptor()
  {
    return this.descriptor;
  }

  public void setDescriptor(String descriptor)
  {
    this.descriptor = descriptor;
  }

  public String getOwner()
  {
    return this.owner;
  }

  public void setOwner(String owner)
  {
    this.owner = owner;
  }

  public String getState()
  {
    return this.state;
  }

  public void setState(String state)
  {
    this.state = state;
  }

  public String getAppGroupName()
  {
    return this.appGroupName;
  }

  public void setAppGroupName(String appGroupName)
  {
    this.appGroupName = appGroupName;
  }

  public String getAppGroupId()
  {
    return this.appGroupId;
  }

  public void setAppGroupId(String appGroupId)
  {
    this.appGroupId = appGroupId;
  }

  public String getFarmId()
  {
    return this.farmId;
  }

  public void setFarmId(String farmId)
  {
    this.farmId = farmId;
  }

  public Integer getFavoriteFlag()
  {
    return this.favoriteFlag;
  }

  public void setFavoriteFlag(Integer favoriteFlag)
  {
    this.favoriteFlag = favoriteFlag;
  }

  public Integer getAppType()
  {
    return this.appType;
  }

  public void setAppType(Integer appType)
  {
    this.appType = appType;
  }

  public String getGroupId()
  {
    return this.groupId;
  }

  public void setGroupId(String groupId)
  {
    this.groupId = groupId;
  }

  public String getUserSid()
  {
    return this.userSid;
  }

  public void setUserSid(String userSid)
  {
    this.userSid = userSid;
  }

  public String getAppName()
  {
    return this.appName;
  }

  public void setAppName(String appName)
  {
    this.appName = appName;
  }
}