package com.huawei.showcase.web.servlet;

import java.io.IOException;
import java.io.OutputStream;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.huawei.showcase.common.util.CommonUtils;
import com.huawei.showcase.common.util.log.LogUtils;

public class LauncherIcaServlet extends HttpServlet
{
  private static final long serialVersionUID = -3925958918588963925L;

  public void destroy()
  {
    super.destroy();
  }

  public void doGet(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException
  {
    OutputStream os = null;
    try
    {
      String icaFileId = request.getParameter("icaFileId");

      String icaContent = request.getSession().getAttribute(icaFileId).toString();
      if (CommonUtils.checkAllStringNull(new String[] { icaContent }))
      {
        LogUtils.VDESKTOP_LOG.error(" icaContent is null");
        return;
      }
      response.setContentLength(icaContent.length());
      response.setCharacterEncoding("UTF-8");
      response.setContentType("application/x-ica");
      response.setHeader("Cache-Control", "private");
      os = response.getOutputStream();
      byte[] buff = icaContent.getBytes("UTF-8");
      int len = buff.length;
      os.write(buff, 0, len);
      os.flush();
    }
    catch (Exception ex)
    {
      LogUtils.VDESKTOP_LOG.error(ex);
    }
    finally
    {
      if (os != null)
      {
        os.close();
      }
    }
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