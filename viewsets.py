from corporate import models
from corporate import serializers
from rest_framework import viewsets, filters


class SeasonViewSet(viewsets.ModelViewSet):
    queryset = models.Season.objects.all()
    serializer_class = serializers.SeasonSerializer
    filters_backends = (filters.SearchFilter, )
    search_fields = ('name', 'code')
    

class CollectionViewSet(viewsets.ModelViewSet):
    queryset = models.Collection.objects.all()
    serializer_class = serializers.CollectionSerializer
    filters_backends = (filters.SearchFilter, )
    search_fields = ('name', 'code')
    

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = models.Category.objects.all()
    serializer_class = serializers.CategorySerializer
    filters_backends = (filters.SearchFilter, )
    search_fields = ('name', 'code')
    
    
class PhaseViewSet(viewsets.ModelViewSet):
    queryset = models.Phase.objects.all()
    serializer_class = serializers.PhaseSerializer
    filters_backends = (filters.SearchFilter, )
    search_fields = ('name', 'code')
    
class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = models.Department.objects.all()
    serializer_class = serializers.DepartmentSerializer
    filters_backends = (filters.SearchFilter, )
    search_fields = ('name', 'code')


class BrandViewSet(viewsets.ModelViewSet):
    queryset = models.Brand.objects.all()
    serializer_class = serializers.BrandSerializer
    filters_backends = (filters.SearchFilter, )
    search_fields = ('name', 'code')


class GenderViewSet(viewsets.ModelViewSet):
    queryset = models.Gender.objects.all()
    serializer_class = serializers.GenderSerializer
    filters_backends = (filters.SearchFilter, )
    search_fields = ('name', 'code')
    

class ColorViewSet(viewsets.ModelViewSet):
    queryset = models.Color.objects.all()
    serializer_class = serializers.ColorSerializer
    filters_backends = (filters.SearchFilter, )
    search_fields = ('name', 'code')
    

class WeaveViewSet(viewsets.ModelViewSet):
    queryset = models.Weave.objects.all()
    serializer_class = serializers.WeaveSerializer
    filters_backends = (filters.SearchFilter, )
    search_fields = ('name', 'code')
    
class MajorFabricViewSet(viewsets.ModelViewSet):
    queryset = models.MajorFabric.objects.all()
    serializer_class = serializers.MajorFabricSerializer
    filters_backends = (filters.SearchFilter, )
    search_fields = ('name', 'code')

class FabricDetailsViewSet(viewsets.ModelViewSet):
    queryset = models.FabricDetails.objects.all()
    serializer_class = serializers.FabricDetailsSerializer
    filters_backends = (filters.SearchFilter, )
    search_fields = ('name', 'code')


class FabricCareViewSet(viewsets.ModelViewSet):
    queryset = models.FabricCare.objects.all()
    serializer_class = serializers.FabricCareSerializer
    filters_backends = (filters.SearchFilter, )
    search_fields = ('name', 'code')


class NeckViewSet(viewsets.ModelViewSet):
    queryset = models.Neck.objects.all()
    serializer_class = serializers.NeckSerializer
    filters_backends = (filters.SearchFilter, )
    search_fields = ('name', 'code')


class FitViewSet(viewsets.ModelViewSet):
    queryset = models.Fit.objects.all()
    serializer_class = serializers.FitSerializer
    filters_backends = (filters.SearchFilter, )
    search_fields = ('name', 'code')


class ShapeViewSet(viewsets.ModelViewSet):
    queryset = models.Shape.objects.all()
    serializer_class = serializers.ShapeSerializer
    filters_backends = (filters.SearchFilter, )
    search_fields = ('name', 'code')
    

class HemlineViewSet(viewsets.ModelViewSet):
    queryset = models.Hemline.objects.all()
    serializer_class = serializers.HemlineSerializer
    filters_backends = (filters.SearchFilter, )
    search_fields = ('name', 'code')
    

class LengthViewSet(viewsets.ModelViewSet):
    queryset = models.Length.objects.all()
    serializer_class = serializers.LengthSerializer
    filters_backends = (filters.SearchFilter, )
    search_fields = ('name', 'code')
    
class SleeveViewSet(viewsets.ModelViewSet):
    queryset = models.Sleeve.objects.all()
    serializer_class = serializers.SleeveSerializer
    filters_backends = (filters.SearchFilter, )
    search_fields = ('name', 'code')


class OccasionViewSet(viewsets.ModelViewSet):
    queryset = models.Occasion.objects.all()
    serializer_class = serializers.OccasionSerializer
    filters_backends = (filters.SearchFilter, )
    search_fields = ('name', 'code')
    

class BaseTypeViewSet(viewsets.ModelViewSet):
    queryset = models.BaseType.objects.all()
    serializer_class = serializers.BaseTypeSerializer
    filters_backends = (filters.SearchFilter, )
    search_fields = ('name', 'code')


class SurfaceViewSet(viewsets.ModelViewSet):
    queryset = models.Surface.objects.all()
    serializer_class = serializers.SurfaceSerializer
    filters_backends = (filters.SearchFilter, )
    search_fields = ('name', 'code')
    

class ClosureViewSet(viewsets.ModelViewSet):
    queryset = models.Closure.objects.all()
    serializer_class = serializers.ClosureSerializer
    filters_backends = (filters.SearchFilter, )
    search_fields = ('name', 'code')
    

class ShadeViewSet(viewsets.ModelViewSet):
    queryset = models.Shade.objects.all()
    serializer_class = serializers.ShadeSerializer
    filters_backends = (filters.SearchFilter, )
    search_fields = ('name', 'code')
    
class StretchViewSet(viewsets.ModelViewSet):
    queryset = models.Stretch.objects.all()
    serializer_class = serializers.StretchSerializer
    filters_backends = (filters.SearchFilter, )
    search_fields = ('name', 'code')


class RiseViewSet(viewsets.ModelViewSet):
    queryset = models.Rise.objects.all()
    serializer_class = serializers.RiseSerializer
    filters_backends = (filters.SearchFilter, )
    search_fields = ('name', 'code')
    

class StyleNumberViewSet(viewsets.ModelViewSet):
    queryset = models.StyleNumber.objects.all()
    serializer_class = serializers.StyleNumberSerializer
    filter_backends = (filters.SearchFilter, )
    search_fields = ('id', 'style_number')


class ArticleNumberViewSet(viewsets.ModelViewSet):
    queryset = models.ArticleNumber.objects.all()
    serializer_class = serializers.ArticleNumberSerializer
    filter_backends = (filters.SearchFilter, )
    search_fields = ('id',  'article_number')


class ProductViewSet(viewsets.ModelViewSet):
    queryset = models.Product.objects.all()
    serializer_class = serializers.ProductSerializer
    filter_bacends = (filters.SearchFilter, )
    search_fields = ('id','barcode',)
    
    



class StoreViewSet(viewsets.ModelViewSet):
    queryset = models.Store.objects.all()
    serializer_class = serializers.StoreSerializer
    filter_bacends = (filters.SearchFilter, )
    search_fields = ('id','name',)
    
    
class WareHouseViewSet(viewsets.ModelViewSet):
    queryset = models.WareHouse.objects.all()
    serializer_class = serializers.WareHouseSerializer
    filter_bacends = (filters.SearchFilter, )
    search_fields = ('id','name',)



class StoreEmpViewSet(viewsets.ModelViewSet):
    queryset = models.StoreEmployee.objects.all()
    serializer_class = serializers.StoreEmployeeSerializer
    
    
class CustomerViewSet(viewsets.ModelViewSet):
    queryset = models.Customer.objects.all()
    serializer_class = serializers.CSerializer


class CartViewSet(viewsets.ModelViewSet):
    queryset = models.Cart.objects.all()
    serializer_class = serializers.CartSerializer


class CartItemViewSet(viewsets.ModelViewSet):
    queryset = models.CartItem.objects.all()
    serializer_class = serializers.CartItemSerializer    


class CreditNoteViewSet(viewsets.ModelViewSet):
    queryset = models.CreditNote.objects.all()
    serializer_class = serializers.CreditNoteSerializer    


class CreditRedeemViewSet(viewsets.ModelViewSet):
    queryset = models.CreditRedeem.objects.all()
    serializer_class = serializers.CreditRedeemSerializer 

    
class SaleInvoiceViewSet(viewsets.ModelViewSet):
    queryset = models.SaleInvoice.objects.all()
    serializer_class = serializers.SalesInvoiceSerializer
    

class SaleItemViewSet(viewsets.ModelViewSet):
    queryset = models.SaleInvoiceItem.objects.all()
    serializer_class = serializers.SaleInvoiceItemSerializer

    
class WSTransferViewSet(viewsets.ModelViewSet):
    queryset = models.WSTransferProduct.objects.all()
    serializer_class = serializers.WSTransferSerializer
    filter_bacends = (filters.SearchFilter, )
    search_fields = ('id','name',)
    
    
class WSTransferDetailSViewSet(viewsets.ModelViewSet):
    queryset = models.WSTransferProduct.objects.all()
    serializer_class = serializers.WareHouseTransferDetailSerializer
    filter_bacends = (filters.SearchFilter, )
    search_fields = ('id','name',)
    
    