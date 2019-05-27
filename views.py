from django.shortcuts import render
from django.views.generic import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin

from django.urls import reverse
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import user_passes_test
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import HttpResponse, HttpResponseRedirect

# NUB3456
# 441XOTU9

class USerMixin(object):
     def dispatch(self, request, *args, **kwargs):
        """
        dispatching view based on user/headofc
        """
        if not request.user.is_superuser:
            return HttpResponseRedirect(reverse('restrcit_page'))
        return super().dispatch(request, *args, **kwargs)
        
        

        
from .forms import ProductFileForm
from django.shortcuts import redirect
import os
import json
from django.core.management.base import BaseCommand
from datetime import datetime
from nuberry.settings import BASE_DIR
import csv

def product_file_view(request):
    if request.method == 'POST':
        form = ProductFileForm(request.POST, request.FILES)
        if form.is_valid():
            print(request.FILES['document'])
            form.save()
            data_folder = os.path.join(BASE_DIR, 'media', 'products/documents')
            for data_file in os.listdir(data_folder):                
                f = open('sample.csv', 'rU')
                reader = csv.DictReader( f, fieldnames = ( "article","barcode","size","mrp" ,"stock" ))  
                out = json.dumps( [ row for row in reader ] )  
                f = open( 'kmData/resources/json_file/products.json', 'w')  
                f.write(out)
                from django.core.management import call_command
            call_command('create_products')
            
            return redirect('corporate')
    else:
        form = ProductFileForm()
    return render(request, 'product_file.html', {'form':form})
    
    
class CorporateView(TemplateView):
    template_name = 'corporate.html'
    


    
class ProductHomeView(LoginRequiredMixin,USerMixin,TemplateView):
    template_name = 'add_product.html'
    
   

class ProductListView(LoginRequiredMixin,USerMixin,TemplateView):
    template_name = 'product_list.html'
    
    
class ConfigureValues(LoginRequiredMixin,USerMixin,TemplateView):
    template_name = 'configure_values.html'
    

    
class GRNView(LoginRequiredMixin,USerMixin, TemplateView):
    template_name = 'grn.html'
    

class CurrentStockView(LoginRequiredMixin,USerMixin,TemplateView):
    template_name = 'current_stock.html'
    
    
class TransferView(LoginRequiredMixin,USerMixin,TemplateView):
    template_name = 'transfer.html'


class InvardView(LoginRequiredMixin,USerMixin,TemplateView):
    template_name = 'invard.html'
    

class StoreActions(LoginRequiredMixin,USerMixin,TemplateView):
    template_name = 'store_actions.html'
    
    
class SalesConfigurationsView(LoginRequiredMixin,USerMixin,TemplateView):
    template_name = 'store_configurations.html'

    
class SalesHomeView(LoginRequiredMixin,USerMixin,TemplateView):
    template_name = 'sales_home.html'
    

class SalesReportView(LoginRequiredMixin,USerMixin,TemplateView):
    template_name = 'sales_report.html'
    
class MovementView(LoginRequiredMixin,USerMixin,TemplateView):
    template_name = 'movement_report.html'


class BestSellingView(LoginRequiredMixin,USerMixin,TemplateView):
    template_name = 'best_selling.html'


class MarketingConfigureDate(LoginRequiredMixin,USerMixin,TemplateView):
    template_name = 'marketing_configurations.html'
    
    
class DiscountView(LoginRequiredMixin,USerMixin,TemplateView):
    template_name = 'discount_list.html'   
    

class CustomerDataView(LoginRequiredMixin,USerMixin,TemplateView):
    template_name = 'customer_data.html'
    
    
class LoyalityView(LoginRequiredMixin,USerMixin,TemplateView):
    template_name = 'loyality.html'
        


class StaffView(LoginRequiredMixin,USerMixin,TemplateView):
    template_name = 'staff.html'


class AttendenceView(LoginRequiredMixin,USerMixin,TemplateView):
    template_name = 'attendence.html'


class StoreExpensesView(LoginRequiredMixin,USerMixin,TemplateView):
    template_name = 'store_expenses.html'
    

class DSRView(LoginRequiredMixin,USerMixin,TemplateView):
    template_name = 'dsr.html'


class StatementsView(LoginRequiredMixin,USerMixin,TemplateView):
    template_name = 'statements.html'


class AboutNuberryView(LoginRequiredMixin,USerMixin,TemplateView):
    template_name = 'about.html'


class BrandFilesView(LoginRequiredMixin,USerMixin,TemplateView):
    template_name = 'brand_files.html'


class SOPGuidlinesView(LoginRequiredMixin,USerMixin,TemplateView):
    template_name = 'sop_guides.html'


class StoreAssetsView(LoginRequiredMixin,USerMixin,TemplateView):
    template_name = 'store_assets.html'


class NotificationView(LoginRequiredMixin,USerMixin,TemplateView):
    template_name = 'notifications.html'
