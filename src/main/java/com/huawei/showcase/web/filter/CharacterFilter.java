package com.huawei.showcase.web.filter;

import com.huawei.showcase.common.util.ContextUtil;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.web.filter.OncePerRequestFilter;

public class CharacterFilter extends OncePerRequestFilter
{
  private static final List<String> EXCLUDEURL = new ArrayList<String>();
  private String encoding;
  private boolean forceEncoding;

  static
  {
    EXCLUDEURL.add("plugin");
    EXCLUDEURL.add("/img");
    EXCLUDEURL.add(".js");
    EXCLUDEURL.add(".css");
  }

  public CharacterFilter()
  {
    this.forceEncoding = false;
  }

  public void setEncoding(String encoding)
  {
    this.encoding = encoding;
  }

  public void setForceEncoding(boolean forceEncoding)
  {
    this.forceEncoding = forceEncoding;
  }

  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
    throws ServletException, IOException
  {
    ContextUtil.createContext(request, response);

    if ( (this.encoding != null && this.forceEncoding) || (request.getCharacterEncoding() == null))
    {
      request.setCharacterEncoding(this.encoding);
     
    }

    String uri = request.getRequestURI();

    for (String excludeUrlString : EXCLUDEURL)
    {
      if (uri.contains(excludeUrlString))
      {
        filterChain.doFilter(request, response);
        return;
      }

    }

    response.addHeader("Cache-Control", "no-store");
    response.addHeader("Pragma", "no-cache");
    filterChain.doFilter(request, response);
  }
}