from rest_framework import serializers
from gascontrolproject.models import Condominio, Torres, Apartamento, Pessoa, Gasometro, Leitura, Relatorio

class CondominioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Condominio
        fields = ['id', 'nome', 'local']
        
class TorresSerializer(serializers.ModelSerializer):
    class Meta:
        model = Torres
        fields = ['id', 'numero', 'identificacao', 'condominio']
        
class ApartamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Apartamento
        fields = ['id', 'numero', 'torre']

class PessoaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pessoa
        fields = '__all__'
        
class GasometroSerializer(serializers.ModelSerializer):
    # Adicionar campos de leitura para mostrar número do apartamento
    apartamento_info = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = Gasometro
        fields = ['id', 'codigo', 'apartamento', 'apartamento_info']
    
    def get_apartamento_info(self, obj):
        return f"Apto {obj.apartamento.numero} - {obj.apartamento.torre.identificacao}"

class LeituraSerializer(serializers.ModelSerializer):
    class Meta:
        model = Leitura
        fields = '__all__'
        
class LeituraDetailSerializer(serializers.ModelSerializer):
    gasometro = GasometroSerializer(read_only=True)
    apartamento = serializers.CharField(source='gasometro.apartamento.numero', read_only=True)
    torre = serializers.CharField(source='gasometro.apartamento.torre.identificacao', read_only=True)
    condominio = serializers.CharField(source='gasometro.apartamento.torre.condominio.nome', read_only=True)
    
    class Meta:
        model = Leitura
        fields = '__all__'


class RelatorioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Relatorio
        fields = '__all__'