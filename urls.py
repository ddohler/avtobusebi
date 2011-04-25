from django.conf.urls.defaults import *
# Uncomment the next two lines to enable the admin:
from django.contrib import admin

from avtobusebi import settings

admin.autodiscover()

urlpatterns = patterns('',
    # Example:
    # (r'^avtobusebi/', include('avtobusebi.foo.urls')),

    # Uncomment the admin/doc line below and add 'django.contrib.admindocs' 
    # to INSTALLED_APPS to enable admin documentation:
    # (r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
     (r'^admin/', include(admin.site.urls)),
     (r'^$', 'routes.views.main'),
     (r'dump/$','routes.views.backup'),
)

if settings.LOCAL_DEV:
    baseurlregex = r'^media/(?P<path>.*)$'
    urlpatterns += patterns('',
        (baseurlregex, 'django.views.static.serve',
        {'document_root':  settings.MEDIA_ROOT}),
    )

