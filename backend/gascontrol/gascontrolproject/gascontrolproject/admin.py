from django.contrib import admin
from .models import Condominio, Torres, Apartamento, Pessoa, Gasometro, Leitura

class Condominios(admin.ModelAdmin):
    list_display = ('nome', 'local',)
    list_display_links = ('nome',)
    search_fields = ('nome', 'local',)
    list_per_page = 20

class TorresAdmin(admin.ModelAdmin):
    list_display = ('identificacao', 'numero', 'condominio',)
    list_display_links = ('identificacao',)
    search_fields = ('identificacao', 'numero', 'condominio__nome',)
    list_filter = ('condominio',)
    list_per_page = 20

class Apartamentos(admin.ModelAdmin):
    list_display = ('numero', 'torre_identificacao', 'condominio_nome',)
    list_display_links = ('numero',)
    search_fields = ('numero', 'torre__identificacao',)
    list_filter = ('torre__condominio', 'torre',)
    list_per_page = 20
    
    def torre_identificacao(self, obj):
        return obj.torre.identificacao
    torre_identificacao.short_description = 'Torre'
    
    def condominio_nome(self, obj):
        return obj.torre.condominio.nome
    condominio_nome.short_description = 'Condomínio'

class Pessoas(admin.ModelAdmin):
    list_display = ('nome', 'tipo', 'apartamento_numero', 'torre_identificacao', 'condominio_nome',)
    list_display_links = ('nome',)
    search_fields = ('nome', 'apartamento__numero',)
    list_filter = ('tipo', 'apartamento__torre__condominio', 'apartamento__torre',)
    list_per_page = 20
    
    def apartamento_numero(self, obj):
        return obj.apartamento.numero
    apartamento_numero.short_description = 'Apartamento'
    
    def torre_identificacao(self, obj):
        return obj.apartamento.torre.identificacao
    torre_identificacao.short_description = 'Torre'
    
    def condominio_nome(self, obj):
        return obj.apartamento.torre.condominio.nome
    condominio_nome.short_description = 'Condomínio'

class Gasometros(admin.ModelAdmin):
    list_display = ('codigo', 'apartamento_numero', 'torre_identificacao', 'condominio_nome',)
    list_display_links = ('codigo',)
    search_fields = ('codigo', 'apartamento__numero',)
    list_filter = ('apartamento__torre__condominio', 'apartamento__torre',)
    list_per_page = 20
    
    def apartamento_numero(self, obj):
        return obj.apartamento.numero
    apartamento_numero.short_description = 'Apartamento'
    
    def torre_identificacao(self, obj):
        return obj.apartamento.torre.identificacao
    torre_identificacao.short_description = 'Torre'
    
    def condominio_nome(self, obj):
        return obj.apartamento.torre.condominio.nome
    condominio_nome.short_description = 'Condomínio'

class Leituras(admin.ModelAdmin):
    list_display = ('gasometro_codigo', 'data_leitura', 'consumo_m3', 'periodicidade', 'apartamento_numero', 'condominio_nome',)
    list_display_links = ('gasometro_codigo',)
    search_fields = ('gasometro__codigo', 'gasometro__apartamento__numero',)
    list_filter = ('data_leitura', 'periodicidade', 'gasometro__apartamento__torre__condominio',)
    list_per_page = 20
    ordering = ('-data_leitura',)
    
    def gasometro_codigo(self, obj):
        return obj.gasometro.codigo
    gasometro_codigo.short_description = 'Gasômetro'
    
    def apartamento_numero(self, obj):
        return obj.gasometro.apartamento.numero
    apartamento_numero.short_description = 'Apartamento'
    
    def condominio_nome(self, obj):
        return obj.gasometro.apartamento.torre.condominio.nome
    condominio_nome.short_description = 'Condomínio'

# Registro dos modelos
admin.site.register(Condominio, Condominios)
admin.site.register(Torres, TorresAdmin)
admin.site.register(Apartamento, Apartamentos)
admin.site.register(Pessoa, Pessoas)
admin.site.register(Gasometro, Gasometros)
admin.site.register(Leitura, Leituras)