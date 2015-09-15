
package com.huawei.showcase.common.downloadservices;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.huawei.showcase.common.util.CommonUtils;
import com.huawei.showcase.common.util.configration.Configuration;
import com.huawei.showcase.common.util.log.LogUtils;

public class ClientDownloadServlet extends HttpServlet
{
  private static final long serialVersionUID = -6943019252963941711L;
  
  private static final String FILEPATH = CommonUtils.getProjAbsolutePath() + System.getProperty("file.separator") + "plugin" + System.getProperty("file.separator");

  public void destroy()
  {
    super.destroy();
  }

  public void doGet(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException
  {
    String checkParam = request.getParameter("checkDownloadFlag");

    if (checkParam != null)
    {
      if (!DownloadCountMonitor.downloadFlag())
      {
        response.setHeader("downloadflag", "false");
        return;
      }

      return;
    }

    String fileName = request.getParameter("name");

    if (CommonUtils.checkAllStringNull(fileName ))
    {
      LogUtils.LOG.error("The fileName is error. fileName = " + fileName);
      return;
    }

    String path = FILEPATH + fileName;
    InputStream input = null;
    OutputStream toClient = null;

    if (!DownloadCountMonitor.addCount())
    {
      LogUtils.LOG.error("The download count is overflow.");
      return;
    }

    Long beginTime = Long.valueOf(System.currentTimeMillis());
    try
    {
      input = new BufferedInputStream(new FileInputStream(path));
      byte[] buffer = new byte[Configuration.getControllerPropInstance().getInt("WI.download.readbuffer", 1024)];
      int len = 0;

      response.reset();
      response.addHeader("Content-Disposition", "attachment;filename=" + new String(fileName.getBytes()));
      toClient = new BufferedOutputStream(response.getOutputStream(), 
        Configuration.getControllerPropInstance().getInt("WI.download.outputbuffer", 1024));
      response.setContentType("application/octet-stream");

      while ((len = input.read(buffer)) > 0)
      {
        toClient.write(buffer, 0, len);
        toClient.flush();
      }

      toClient.close();
    }
    catch (Exception e)
    {
      LogUtils.LOG.error("Canot read file, catch exception ", e);
    }
    finally
    {
      if (input != null)
      {
        input.close();
      }
      if (toClient != null)
      {
        toClient.close();
      }

      DownloadCountMonitor.decreaseCount();
    }

    LogUtils.LOG.debug("Total cost time  " + (System.currentTimeMillis() - beginTime.longValue()));
  }

  public void doPost(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException
  {
    doGet(request, response);
  }

  public void init()
    throws ServletException
  {
  }
}