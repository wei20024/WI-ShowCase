package com.huawei.showcase.model;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;

@XmlRootElement(name="VmList")
@XmlAccessorType(XmlAccessType.FIELD)
public class VmModel implements java.io.Serializable
{
  
/**
	 * 
	 */
	private static final long serialVersionUID = 5250582993141333887L;

@XmlElement(name="farmId")
  private String farmId;

  @XmlElement(name="sid")
  private String sid;

  @XmlElement(name="id")
  private String id;

  @XmlElement(name="name")
  private String name;

  @XmlElement(name="type")
  private String type;

  @XmlElement(name="state")
  private String state;

  @XmlElement(name="inMaintenanceMode")
  private String inMaintenanceMode;

  @XmlElement(name="vmDomain")
  private String vmDomain;

  @XmlElement(name="dgId")
  private String dgId;

  @XmlElement(name="dgName")
  private String dgName;

  @XmlElement(name="hdaVersion")
  private String agentVersion;

  @XmlElement(name="isFistStaticGroup")
  private String isFistStaticGroup;

  @XmlElement(name="platformKind")
  private int platformKind;

  @XmlElement(name="vmVersion")
  private String vmVersion = "R51";

  @XmlElement(name="groupId")
  private String groupId; //WI id

  @XmlElement(name="groupVmOpFlag")
  private Integer groupVmOpFlag;

  @XmlElement(name="vipFlag")
  private Integer vipFlag;

  @Override
  public boolean equals(Object other)
  {
	  VmModel otherVm = (VmModel)other;
	  if(this.sid.equals(otherVm.sid))return true;
	  return false;
  }
  
  public void setFarmId(String farmId)
  {
    this.farmId = farmId;
  }

  public String getSid()
  {
    return this.sid;
  }

  public void setSid(String sid)
  {
    this.sid = sid;
  }

  public String getName()
  {
    return this.name;
  }

  public void setName(String name)
  {
    this.name = name;
  }

  public String getType()
  {
    return this.type;
  }

  public void setType(String type)
  {
    this.type = type;
  }

  public String getState()
  {
    return this.state;
  }

  public void setState(String state)
  {
    this.state = state;
  }

  public String getVmDomain()
  {
    return this.vmDomain;
  }

  public void setVmDomain(String vmDomain)
  {
    this.vmDomain = vmDomain;
  }

  public String getDgId()
  {
    return this.dgId;
  }

  public String isInMaintenanceMode()
  {
    return this.inMaintenanceMode;
  }

  public void setInMaintenanceMode(String inMaintenanceMode)
  {
    this.inMaintenanceMode = inMaintenanceMode;
  }

  public void setDgId(String dgId)
  {
    this.dgId = dgId;
  }

  public String getDgName()
  {
    return this.dgName;
  }

  public void setDgName(String dgName)
  {
    this.dgName = dgName;
  }

  public String getAgentVersion()
  {
    return this.agentVersion;
  }

  public void setAgentVersion(String agentVersion)
  {
    this.agentVersion = agentVersion;
  }

  public String getIsFistStaticGroup()
  {
    return this.isFistStaticGroup;
  }

  public void setIsFistStaticGroup(String isFistStaticGroup)
  {
    this.isFistStaticGroup = isFistStaticGroup;
  }

  public String toString()
  {
    return ToStringBuilder.reflectionToString(this, ToStringStyle.MULTI_LINE_STYLE);
  }

  public String getVmVersion()
  {
    return this.vmVersion;
  }

  public void setVmVersion(String vmVersion)
  {
    this.vmVersion = vmVersion;
  }

  public String getGroupId()
  {
    return this.groupId;
  }

  public void setGroupId(String groupId)
  {
    this.groupId = groupId;
  }

  public String getFarmId()
  {
    return this.farmId;
  }

  public String getInMaintenanceMode()
  {
    return this.inMaintenanceMode;
  }

  public String getId()
  {
    return this.id;
  }

  public void setId(String id)
  {
    this.id = id;
  }

  public int getPlatformKind()
  {
    return this.platformKind;
  }

  public void setPlatformKind(int platformKind)
  {
    this.platformKind = platformKind;
  }

  public Integer getVipFlag()
  {
    return this.vipFlag;
  }

  public void setVipFlag(Integer vipFlag)
  {
    this.vipFlag = vipFlag;
  }

  public Integer getGroupVmOpFlag()
  {
    return this.groupVmOpFlag;
  }

  public void setGroupVmOpFlag(Integer groupVmOpFlag)
  {
    this.groupVmOpFlag = groupVmOpFlag;
  }
}