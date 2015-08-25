package com.huawei.showcase.model.response;


import com.huawei.showcase.model.WiAttachInfo;
import java.util.List;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name="SynUserDataRsp")
public class SynUserDataRsp extends CommonRsp
{
  private static final long serialVersionUID = 1567890L;
  private List<WiAttachInfo> wiAttachInfos;

  public List<WiAttachInfo> getWiAttachInfos()
  {
    return this.wiAttachInfos;
  }

  public void setWiAttachInfos(List<WiAttachInfo> wiAttachInfos)
  {
    this.wiAttachInfos = wiAttachInfos;
  }
}