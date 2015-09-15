package com.huawei.showcase.model.response;


import com.huawei.showcase.model.AppModel;
import com.huawei.showcase.model.VmModel;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;

@XmlRootElement(name="GetVmListRsp")
@XmlAccessorType(XmlAccessType.FIELD)
public class GetVmListRsp extends CommonRsp
{
  private static final long serialVersionUID = 1256766317176525L;
  private String farmId; //WI id

  @XmlElement(name="vms")
  private List<VmModel> vmList;

  @XmlElement(name="appInfos")
  private List<AppModel> appInfos;

  @XmlElement(name="myAppInfos")
  private List<AppModel> myAppInfos;
  private Map<String, String> ipTokens = new HashMap<String, String>();

  public List<VmModel> getVmList()
  {
    return this.vmList;
  }

  public void setVmList(List<VmModel> vmList)
  {
    this.vmList = vmList;
  }

  public String toString()
  {
    return ToStringBuilder.reflectionToString(this, ToStringStyle.MULTI_LINE_STYLE);
  }

  public Map<String, String> getIpTokens()
  {
    return this.ipTokens;
  }

  public void setIpTokens(Map<String, String> ipTokens)
  {
    this.ipTokens = ipTokens;
  }

  public String getFarmId()
  {
    return this.farmId;
  }

  public void setFarmId(String farmId)
  {
    this.farmId = farmId;
  }

  public List<AppModel> getAppInfos()
  {
    return this.appInfos;
  }

  public void setAppInfos(List<AppModel> appInfos)
  {
    this.appInfos = appInfos;
  }

  public List<AppModel> getMyAppInfos()
  {
    return this.myAppInfos;
  }

  public void setMyAppInfos(List<AppModel> myAppInfos)
  {
    this.myAppInfos = myAppInfos;
  }
}