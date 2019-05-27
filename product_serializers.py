"""
"""

from rest_framework import serializers
from corporate import models
from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate


class LoginUserSerializer(serializers.Serializer):
    """
    User login serializer handles authentication 
    """
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Unable to log in with provided credentials.")
        

class UserSerializer(serializers.ModelSerializer):
    """
    UserSerializer will be used to return the output \n
    after the user has successfully registered
    """
    class Meta:
        model = User
        fields = ('id', 'username')

        
class SeasonSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Season
        fields = ('id', 'name', 'code')
        

class CollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Collection
        fields = ('id', 'name', 'code')


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Category
        fields = ('id', 'name', 'code')
        
class PhaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Phase
        fields = ('id', 'name', 'code')
        

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Department
        fields = ('id', 'name', 'code')


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Brand
        fields = ('id', 'name', 'code')
        

class GenderSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Gender
        fields = ('id', 'name', 'code')


class PGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.PGroup
        fields = ('id', 'name', 'code')
        

class ComboSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Combo
        fields = ('id', 'name', 'code')
        
        
class ColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Color
        fields = ('id', 'name', 'code')
        

class WeaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Weave
        fields = ('id', 'name', 'code')
        
        
class MajorFabricSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.MajorFabric
        fields = ('id', 'name', 'code')
        

class FabricDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.FabricDetails
        fields = ('id', 'name', 'code')
        
        
class FabricCareSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Season
        fields = ('id', 'name', 'code')
        

class NeckSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Neck
        fields = ('id', 'name', 'code')
        
        
class FitSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Fit
        fields = ('id', 'name', 'code')
        

class ShapeSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Shape
        fields = ('id', 'name', 'code')
        
        
class HemlineSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Hemline
        fields = ('id', 'name', 'code')
        

class LengthSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Length
        fields = ('id', 'name', 'code')
        
        
class SleeveSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Sleeve
        fields = ('id', 'name', 'code')
        

class OccasionSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Occasion
        fields = ('id', 'name', 'code')  
        
class BaseTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.BaseType
        fields = ('id', 'name', 'code')
        

class SurfaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Surface
        fields = ('id', 'name', 'code')
        
        
class ClosureSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Closure
        fields = ('id', 'name', 'code')
        

class ShadeSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Shade
        fields = ('id', 'name', 'code')
        
        
class StretchSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Stretch
        fields = ('id', 'name', 'code')
                
        
class RiseSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Rise
        fields = ('id', 'name', 'code')



class LatesetStyleNumberSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.StyleNumber
        fields = '__all__'
    
class StyleNumberSerializer(serializers.Serializer):
    brand = serializers.CharField()
    weave = serializers.CharField()
    category = serializers.CharField()
    gender = serializers.CharField()
    
    def create(self, validated_data):
        print("form 1")
        return validated_data
        

class StyleNumberDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.StyleNumber
        fields = '__all__'


class LatestArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ArticleNumber
        fields = '__all__'
        
        
class ArticleNumberSerializer(serializers.Serializer):
    style_number = serializers.CharField()
    group = serializers.CharField()
    color = serializers.CharField()
    material_code = serializers.CharField()
    po_number = serializers.CharField()
    vendor = serializers.CharField()
    
    def create(self, validated_data):
        return validated_data
    

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Product
        fields = '__all__'
                  
                

class StoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Store
        fields = '__all__'
        

class StoreEmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.StoreEmployee
        fields = '__all__'
        
class StoreEmployeeCreateSerializer(serializers.Serializer):
    store = serializers.CharField()
    email = serializers.EmailField()
    number = serializers.IntegerField()
    date_of_join = serializers.DateField()
    
    def create(self, validated_data):
        return validated_data
        
class WareHouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.WareHouse
        fields = '__all__'
        

class CustomerSerializer(serializers.ModelSerializer):
     
    class Meta:
        model = models.Customer
        fields = '__all__'
        
        
class CustomerCreateSerializer(serializers.Serializer):
    mobile_number = serializers.CharField()
    name = serializers.CharField()

    def create(self, validated_data):
        num = validated_data['mobile_number']
        name = validated_data['name'].upper()
        models.Customer.objects.create(mobile_number=num, name=name)
        return validated_data

        
class CartSerializer(serializers.ModelSerializer):
    customer = CustomerSerializer()
    sold_by = StoreEmployeeSerializer()
    
    class Meta:
        model = models.Cart
        fields  = '__all__'
        

class CartItemSerializer(serializers.ModelSerializer):
    customer = CustomerSerializer()
    sold_by = StoreEmployeeSerializer()
    product = ProductSerializer()
    
    class Meta:
        model = models.CartItem
        fields = '__all__'


class SalesInvoiceSerializer(serializers.ModelSerializer):
    customer = CustomerSerializer()

    class Meta:
        model = models.SaleInvoice
        fields = '__all__'
        
class CSerializer(serializers.ModelSerializer):
    saleinvoice_set = SalesInvoiceSerializer(read_only=True, many=True)
     
    class Meta:
        model = models.Customer
        fields = '__all__'
        
        
class SaleInvoiceItemSerializer(serializers.ModelSerializer):
    """
    """
    sale_invoice = SalesInvoiceSerializer()
    item = ProductSerializer()

    
    class Meta:
        model = models.SaleInvoiceItem
        fields = '__all__'
        
        
class CreditNoteCreateSerializer(serializers.Serializer):
    """
    """
    credit_number = serializers.CharField()
    credit_amount = serializers.IntegerField()
    credit_issue = serializers.CharField()

    def create(self, validated_data):
        return validated_data
        

class CreditNoteSerializer(serializers.ModelSerializer):
    """
    """
    credit_made = StoreEmployeeSerializer()
    created_store = StoreSerializer()
    credit_invoice = SalesInvoiceSerializer()
    
    class Meta:
        model = models.CreditNote
        fields =  ('id', 'credit_number','customer', 'credit_invoice','created_store', 'credit_date',  'credit_made', 'credit_amount', 'reason', 'status','issue')

    
class CreditRedeemSerializer(serializers.ModelSerializer):
    """
    """
    credit_note = CreditNoteSerializer()
    redeem_store = StoreSerializer()
    redeem_by = StoreEmployeeSerializer()
    redeem_invoice = SalesInvoiceSerializer()
    
    class Meta:
        model = models.CreditRedeem
        fields = ('id','customer', 'credit_note','redeem_invoice', 'redeem_store', 'redeem_amount', 'redeem_amount', 'redeem_by', 'redeem_date', 'redeem_time')
    
    
class HoldItemSerializer(serializers.ModelSerializer):
    customer = CustomerSerializer()
    product = ProductSerializer()

    class Meta:
        model = models.HoldItem
        fields = '__all__'

        
class WSTransferSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.WSTransferProduct
        fields = '__all__'
        
        
class WareHouseTransferSerializer(serializers.Serializer):
    store = serializers.CharField()
    product = serializers.CharField()
    trans_quantity = serializers.IntegerField()
    transfer_origin  =  serializers.CharField()
    
    def create(self, validated_data):
        return validated_data


class WareHouseInwardSerializer(serializers.Serializer):
    product = serializers.IntegerField()
    accepted_note = serializers.CharField()
    
    def create(self, validated_data):
        return validated_data
        
 
class WareHouseTransferDetailSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    store = StoreSerializer()    
    class Meta:
        model = models.WSTransferProduct
        fields = '__all__'


class StoreTransferRequestSerializer(serializers.ModelSerializer):
    store = StoreSerializer()
    product = ProductSerializer()
    
    class Meta:
        model = models.StoreProduct
        fields = '__all__'


class PosProductSerializer(serializers.ModelSerializer):
    store  = StoreSerializer()
    product  = ProductSerializer()
    
    class Meta:
        model = models.PosProduct
        fields = '__all__'
        
        
class WareHouseAcceptSerializer(serializers.Serializer):
    wh_product = serializers.IntegerField()
    rec_quantity = serializers.IntegerField()
    accepted_note = serializers.CharField()
    
    def create(self, validated_data):
        return validated_data


class StoreTransferSerializer(serializers.Serializer):
    s_product = serializers.IntegerField()
    trans_note = serializers.CharField()
    
    def create(self, validated_data):
        return validated_data


class StoreAcceptSerializer(serializers.Serializer):
    pass